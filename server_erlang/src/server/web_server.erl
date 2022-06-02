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
  io:format("Inside the init/2 callback.\n", []),
  {cowboy_websocket, Req, State, #{idle_timeout => infinity}}.

websocket_init(State) ->
  io:format("Inside the websocket_init callback.\n", []),
  io:format("PID of Websocket server is ~p. ~n", [self()]),
  {[{text, <<"Web socket server connection success">>}], State}.

websocket_handle({text, Frame}, State) ->
  io:format("Frame received: ~p\n", [Frame]),
  Json = jsx:decode(Frame, [return_maps]),
  Sender = binary_to_atom(maps:get(<<"sender">>, Json)),
  Receiver = binary_to_atom(maps:get(<<"receiver">>, Json)),
  Type = binary_to_atom(maps:get(<<"type">>, Json)),
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
      PID = process_info(self(), registered_name),
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
    send_request ->
      NewState = State,
      whereis(Receiver) ! Frame,
      Response = jsx:encode(#{<<"type">> => <<"info">>,
        <<"sender">> => <<"WebSocket">>,
        <<"data">> => <<"Request correctly sent!">>});
    accept_request ->
      NewState = State,
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


terminate ({remote,_,_}, _Req, _) ->
  Username = element(2, erlang:process_info(self(), registered_name)),
  io:format("*** Connection with ~p closed\n", [Username]),
  sinkandwin_server ! {delUser, Username};

terminate (TerminateReason, _Req, _) ->
  io:format("*** Termination: ~p\n", [TerminateReason]),
  Username = element(2, erlang:process_info(self(), registered_name)),
  io:format("*** Process: ~p\n", [Username]).
