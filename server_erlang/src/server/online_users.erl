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
  %%online_users:start_server(),
  io:fwrite("Server starts \n"),
  Server = spawn(fun()-> main_loop([], []) end),
  register(sinkandwin_server, Server),
  io:fwrite("Server registered \n").

main_loop(OnlineUsersList, OnGameUserList) ->
  io:fwrite("Main loop started \n"),
  receive
    {addUser, Username} ->
      notify_all({addUser,Username}, OnlineUsersList),
      NewListUsers = OnlineUsersList ++ [Username], %% or lists:append(OnlineUsersList, [Username])
      %%%NewListUsers = online_users:add_users(Username),
      io:format("Online users : ~p\n", [NewListUsers]),
      main_loop(NewListUsers, OnGameUserList);
    {getUser, Username} ->
      notify_one({online_users, Username}, OnlineUsersList),
      notify_one({ongame_users, Username}, OnGameUserList),
      io:format("Online users : ~p\n", [OnlineUsersList]),
      io:format("On game user : ~p\n", [OnGameUserList]),
      main_loop(OnlineUsersList, OnGameUserList);
    {onGameUser, Username} ->
      %%NewListUsers = lists:delete(Username, OnlineUsersList),
      notify_all({onGameUser, Username}, OnlineUsersList),
      NewOnGameUserList = OnGameUserList ++ [Username], %% or lists:append(OnlineUsersList, [Username])
      io:format("On game user : ~p\n", [Username]),
      main_loop(OnlineUsersList, NewOnGameUserList);
    {delUser, Username} ->
      NewListUsers = lists:delete(Username, OnlineUsersList),
      %NewOnGameUserList = lists:delete(Username, OnGameUserList),
      notify_all({delUser, Username}, NewListUsers),
      io:format("Online users : ~p\n", [NewListUsers]),
      main_loop(NewListUsers, OnGameUserList);
    _ -> ok
  end,
  main_loop(OnlineUsersList, OnGameUserList).


notify_all(_, []) ->
  ok;

notify_all({addUser,CurrentUser}, [First | Others]) ->
  whereis(First) ! jsx:encode(#{<<"type">> => <<"add_user">>,
    <<"sender">> => <<"WebSocket">>,
    <<"data">> => CurrentUser}),
  notify_all({addUser, CurrentUser}, Others);

notify_all({delUser,CurrentUser}, [First | Others]) ->
  whereis(First) ! jsx:encode(#{<<"type">> => <<"delete_user">>,<<"data">> => CurrentUser}),
  notify_all({delUser, CurrentUser}, Others);

notify_all({onGameUser,CurrentUser}, [First | Others]) ->
  whereis(First) ! jsx:encode(#{<<"type">> => <<"ongame_user">>,
    <<"sender">> => <<"WebSocket">>,
    <<"data">> => CurrentUser}),
  notify_all({onGameUser, CurrentUser}, Others).

notify_one({online_users,Username}, UsersList) ->
  whereis(Username) ! jsx:encode(#{<<"type">> => <<"user_list">>, <<"data">> => UsersList});

notify_one({ongame_users,Username}, UsersList) ->
  whereis(Username) ! jsx:encode(#{<<"type">> => <<"ongame_list">>, <<"data">> => UsersList}).


