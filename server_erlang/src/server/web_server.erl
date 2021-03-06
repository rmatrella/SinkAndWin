%%%-------------------------------------------------------------------
%%% @author matre
%%% @copyright (C) 2022, <COMPANY>
%%% @doc
%%%
%%% @end
%%% Created : 24. mag 2022 14:51
%%%-------------------------------------------------------------------
-module(web_server).
-author("matrella").

%% API
-export([init/2, websocket_init/1, websocket_handle/2, websocket_info/2, terminate/3]).

%% called when the request is received
init(Req, State) ->
  {cowboy_websocket, Req, State, #{idle_timeout => infinity}}.

websocket_init(State) ->
  {[{text, jsx:encode(#{<<"type">> => <<"info">>,
    <<"sender">> => <<"WebSocket">>,
    <<"data">> => <<"Web socket server connection success">>})}], State}.

websocket_handle({text, Frame}, State) ->
  io:format("Frame received: ~p\n", [Frame]),
  Json = jsx:decode(Frame, [return_maps]),
  Sender = binary_to_atom(maps:get(<<"sender">>, Json)),
  Receiver = binary_to_atom(maps:get(<<"receiver">>, Json)),
  Type = binary_to_atom(maps:get(<<"type">>, Json)),
  Data =  binary_to_atom(maps:get(<<"data">>, Json)),
  case Type of
    user_registration ->
      SenderPID = whereis(Sender),
      if
        SenderPID =/= undefined -> %% user already logged in
          Response = jsx:encode(#{<<"type">> => <<"error">>,
            <<"sender">> => <<"WebSocket">>,
            <<"data">> => <<"User already logged!">>}),
          NewState = State;
        true ->
          register(Sender, self()),
          sinkandwin_server ! {getUser, Sender},
          sinkandwin_server ! {addUser, Sender},
          Response = jsx:encode(#{<<"type">> => <<"info">>,
            <<"sender">> => <<"WebSocket">>,
            <<"data">> => <<"Now you are online!">>}),
          NewState = State
      end;
    add_online ->
      PID = process_info(self(), registered_name), %%verify if the process is registered
      if
        PID == [] -> %% this means that the process is not registered, so the user is not logged in
          Response = jsx:encode(#{<<"type">> => <<"error">>,
            <<"sender">> => <<"WebSocket">>,
            <<"data">> => <<"User not logged!">>}),
          NewState = State;
        true ->
          Name = element(2, PID),
          sinkandwin_server ! {addUser, Name},
          Response = jsx:encode(#{<<"type">> => <<"info">>,
            <<"sender">> => <<"WebSocket">>,
            <<"data">> => <<"Now you are online!">>}),
          NewState = State
      end;
    ongame_user ->
      register(Sender, self()),
      sinkandwin_server ! {onGameUser,Sender},
      Response = jsx:encode(#{<<"type">> => <<"info">>,
        <<"sender">> => <<"WebSocket">>,
        <<"data">> => <<"Update correctly sent!">>}),
      NewState = {opponent, Data};
    send_request ->
      NewState = State,
      whereis(Receiver) ! Frame,
      Response = jsx:encode(#{<<"type">> => <<"info">>,
        <<"sender">> => <<"WebSocket">>,
        <<"data">> => <<"Request correctly sent!">>});
    cancel_request ->
      NewState = State,
      whereis(Receiver) ! Frame,
      Response = jsx:encode(#{<<"type">> => <<"info">>,
        <<"sender">> => <<"WebSocket">>,
        <<"data">> => <<"Cancel request correctly sent!">>});
    accept_request ->
      PID = process_info(self(), registered_name),
      Name = element(2, PID),
      NewState = State,
      sinkandwin_server ! {onGameUser,Name},
      whereis(Receiver) ! Frame,
      Response = jsx:encode(#{<<"type">> => <<"info">>,
        <<"sender">> => <<"WebSocket">>,
        <<"data">> => <<"Request correctly accepted!">>});
    game_move ->
      NewState = State,
      whereis(Receiver) ! Frame,
      Response = jsx:encode(#{<<"type">> => <<"info">>,
        <<"sender">> => <<"WebSocket">>,
        <<"data">> => <<"Move correctly sent!">>});
    move_reply ->
      NewState = State,
      whereis(Receiver) ! Frame,
      Response = jsx:encode(#{<<"type">> => <<"info">>,
        <<"sender">> => <<"WebSocket">>,
        <<"data">> => <<"Response correctly sent!">>});
    surrender ->
      SenderPID = whereis(Receiver),
      if
        SenderPID =/= undefined ->
          SenderPID ! Frame,
          NewState = {surrender},
          Response = jsx:encode(#{<<"type">> => <<"info">>,
            <<"sender">> => <<"WebSocket">>,
            <<"text">> => <<"Message sent!">>});
        true ->
          NewState = State,
          Response = jsx:encode(#{<<"type">> => <<"error">>,
            <<"sender">> => <<"WebSocket">>,
            <<"text">> => <<"Receiver unavailable!">>})
      end;
    _ ->
      NewState = State,
      Response = jsx:encode(#{<<"type">> => <<"nothing">>,
        <<"sender">> => <<"WebSocket">>,
        <<"data">> => <<"">>})
  end,
  {[{text, Response}], NewState};

websocket_handle (_, State) -> {ok, State}.

%% The websocket_info/2 callback is called when we use the ! operator
%% So Cowboy will call websocket_info/2 whenever an Erlang message arrives.
websocket_info (stop, State) ->
  {stop, State}; %% Say to the server to terminate the connection

websocket_info(close, State) ->
  {[{close, 1000, <<"some-reason">>}], State};

websocket_info(Info, State) ->
  {[{text, Info}], State}. %% Returns this message to the client

terminate (TerminateReason, _Req, {opponent, OpponentUsername}) ->
  io:format("Terminate reason: ~p\n", [TerminateReason]),
  OpponentPID = whereis(OpponentUsername),
  if
    OpponentPID =/= undefined -> %% The opponent is not already disconnected
      OpponentPID ! jsx:encode(#{<<"type">> => <<"opponent_disconnected">>});
    true ->
      ok
  end;

terminate(TerminateReason, _Req, {error, Msg}) ->
  io:format("Terminate reason: ~p\n", [TerminateReason]),
  io:format("*** Error: ~p\n", [Msg]);

terminate (TerminateReason, _Req, {surrender}) ->
  io:format("Surrender: ~p\n", [self()]),
  io:format("Terminate reason: ~p\n", [TerminateReason]);

 terminate ({remote,_,_}, _Req, _) ->
  Username = element(2, erlang:process_info(self(), registered_name)),
   io:format("*** Connection with ~p closed\n", [Username]),
   sinkandwin_server ! {delUser, Username}.
