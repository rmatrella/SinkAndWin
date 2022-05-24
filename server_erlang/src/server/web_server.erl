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
-export([websocket_init/1, init/2]).

init(Req, State) ->
  io:format("Inside the init/2 callback.\n", []),
  {cowboy_websocket, Req, State, #{idle_timeout => infinity}}.

websocket_init(State) ->
  io:format("Inside the websocket_init callback.\n", []),
  io:format("PID of Websocket server is ~p. ~n", [self()]),
  {[{text, <<"Web socket server connection success">>}], State}.
