%%%-------------------------------------------------------------------
%%% @author matre
%%% @copyright (C) 2022, <COMPANY>
%%% @doc
%%%
%%% @end
%%% Created : 22. mag 2022 17:42
%%%-------------------------------------------------------------------
-module(online_users).
-author("matrella").
%% USE lists:nth/2 to find the index elem of and elemenent into a list!
%% API
-export([init_main/0]).

init_main() ->
  gen_server_online_users:start_server(),
  io:fwrite("Server starts \n"),
  Server = spawn(fun()-> main_loop() end),
  register(sinkandwin_server, Server),
  io:fwrite("Server registered \n").

main_loop() ->
  io:fwrite("Main loop started \n"),
  receive
    {addUser, Username} ->
      OnlineUsersList = gen_server_online_users:add_user(Username),
      notify_all({addUser,Username}, OnlineUsersList),
      io:format("Online users : ~p\n", [OnlineUsersList]),
      main_loop();
    {getUser, Username} ->
      OnlineUsersList = gen_server_online_users:get_users(),
      io:format("Online users : ~p\n", [OnlineUsersList]),
      notify_one({online_users, Username}, OnlineUsersList),
      main_loop();
    {onGameUser, Username} ->
      OnlineUsersList = gen_server_online_users:delete_user(Username),
      notify_all({onGameUser, Username}, OnlineUsersList),
      io:format("On game user : ~p\n", [Username]),
      main_loop();
    {delUser, Username} ->
      OnlineUsersList = gen_server_online_users:delete_user(Username),
      notify_all({delUser, Username}, OnlineUsersList),
      io:format("Online users : ~p\n", [OnlineUsersList]),
      main_loop();
    _ -> ok
  end,
  main_loop().


notify_all(_, []) ->
  ok;

notify_all({addUser,CurrentUser}, [First | Others]) ->
  whereis(First) ! jsx:encode(#{<<"type">> => <<"add_user">>,
    <<"sender">> => <<"WebSocket">>,
    <<"data">> => CurrentUser}),
  notify_all({addUser, CurrentUser}, Others);

notify_all({delUser,CurrentUser}, [First | Others]) ->
  User = whereis(First),
  if User =/= undefined ->
    whereis(First) ! jsx:encode(#{<<"type">> => <<"delete_user">>,<<"data">> => CurrentUser});
    true -> ok
  end,
  notify_all({delUser, CurrentUser}, Others);

notify_all({onGameUser,CurrentUser}, [First | Others]) ->
  whereis(First) ! jsx:encode(#{<<"type">> => <<"ongame_user">>,
    <<"sender">> => <<"WebSocket">>,
    <<"data">> => CurrentUser}),
  notify_all({onGameUser, CurrentUser}, Others).

notify_one({online_users,Username}, UsersList) ->
  whereis(Username) ! jsx:encode(#{<<"type">> => <<"user_list">>, <<"data">> => UsersList}).


