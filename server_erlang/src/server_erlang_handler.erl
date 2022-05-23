-module(server_erlang_handler).
-export([init/2]).

init(Req, State) ->
	Resp = cowboy_req:reply(200,
		#{<<"Content-Type">> => <<"text/html">>},
		<<"<h3>Hello Rebar3 </h3>">>,
		Req),
	{ok, Resp, State}.
