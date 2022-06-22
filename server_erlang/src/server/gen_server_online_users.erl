%%%-------------------------------------------------------------------
%%% @author matre
%%% @copyright (C) 2022, <COMPANY>
%%% @doc
%%%
%%% @end
%%% Created : 08. giu 2022 17:24
%%%-------------------------------------------------------------------
-module(gen_server_online_users).
-author("matrella").
-behaviour(gen_server).
%% API
-export([start_server/0]).
-export([add_user/1, delete_user/1, get_users/0, stop/0]).
-export([init/1, handle_call/3, handle_cast/2]).


start_server() ->
  gen_server:start({local, gen_server_online_users}, ?MODULE, [], []).

add_user(Username) ->
  gen_server:call(gen_server_online_users, {add, Username}).

delete_user(Username) ->
  gen_server:call(gen_server_online_users, {delete, Username}).

get_users() ->
  gen_server:call(gen_server_online_users, get).

stop() ->
  gen_server:cast(gen_server_online_users, stop).

init(_Args) ->
  {ok, {[]}}.

handle_call({add, Username}, _From, {List}) ->
  OnlineUsersList = List ++ [Username],
  io:format("Online users : ~p\n", [OnlineUsersList]),
  {reply, List, {OnlineUsersList}};

handle_call({delete, Username}, _From, {List}) ->
  OnlineUsersList = lists:delete(Username, List),
  io:format("Online users : ~p\n", [OnlineUsersList]),
  {reply, OnlineUsersList, {OnlineUsersList}};

handle_call(get, _From, {List}) ->
  {reply, List, {List}}.

handle_cast(stop, _State) ->
  {stop, reason, _State};

handle_cast(reset, _State) ->
  {noreply, {[]}}.