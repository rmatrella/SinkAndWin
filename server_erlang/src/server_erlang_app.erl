%%%-------------------------------------------------------------------
%% @doc server_erlang public API
%% @end
%%%-------------------------------------------------------------------

-module(server_erlang_app).
-import('online_users', [init_main/0]).
-behaviour(application).

-export([start/2, stop/1]).

start(_StartType, _StartArgs) ->
	online_users:init_main(),
	Dispatch = cowboy_router:compile([
		{'_', [{"/ws", web_server, []}]}
	]),
	{ok, _} = cowboy:start_clear(http_listener, 
		[{port, 8090}], 
		#{env => #{dispatch => Dispatch}}
	),
	%% online_users:init_main(),
	server_erlang_sup:start_link().

stop(_State) ->
    ok = cowboy:stop_listener(http_listener).

%% internal functions
