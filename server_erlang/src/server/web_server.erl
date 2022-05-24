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
-export([websocket_init/1, init/2, websocket_handle/2, websocket_info/2]).

init(Req, State) ->
  io:format("Inside the init/2 callback.\n", []),
  {cowboy_websocket, Req, State, #{idle_timeout => infinity}}.

websocket_init(State) ->
  io:format("Inside the websocket_init callback.\n", []),
  io:format("PID of Websocket server is ~p. ~n", [self()]),
  {[{text, <<"Web socket server connection success">>}], State}.

websocket_handle(Frame, State) ->
  io:format("Frame received: ~p\n", [Frame]),

  Json = jsx:decode(Frame, [return_maps]),
  Sender = binary_to_atom(maps:get(<<"sender">>, Json)),
  Receiver = binary_to_atom(maps:get(<<"receiver">>, Json)),
  Type = binary_to_atom(maps:get(<<"type">>, Json)),

  io:format("before case"),
  case Type of
    _ -> io:format("case")
    end,
  ok;

websocket_handle (_, State) -> {ok, State}.

websocket_info (stop, State) ->
  {stop, State}; %% Say to the server to terminate the connection


%% This function can be used to send a message Info to this process by another process
websocket_info(Info, State) ->
  {[{text, Info}], State}. %% Returns this message to the client
