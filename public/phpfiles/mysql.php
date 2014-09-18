<?php
header('Access-Control-Allow-Origin: *');

//noticeエラーを出力しない
error_reporting(E_ALL & ~E_NOTICE);

// MySQLへ接続する準備。DB名や認証に必要な情報を格納
$url = "localhost";
$user = "root";
$pass = "himutu";
$db = "gcs";

// MySQLへ接続する
$connect = mysql_connect($url, $user, $pass) or die("MySQLへの接続に失敗しま
した。");

// データベースを選択する
$sdb = mysql_select_db($db, $connect) or die("データベースの選択に失敗しまし
た。");

// クエリを送信する
//$sql = "SELECT * FROM words WHERE status_flag = 1 AND id >= " . htmlspecialchars($_GET["s"]) . " AND id < ".  htmlspecialchars($_GET["e"]) . " ORDER BY id";
$sql = "SELECT * FROM words WHERE status_flag = 1 ORDER BY frequency DESC limit 300";
$result = mysql_query($sql, $connect) or die("クエリの送信に失敗しました。<b
r />SQL:".$sql);

$i=1;

while($row = mysql_fetch_array($result)) {

        $array_data[strval($i)] = array(
                        "id" => $row['id'],
                        "name" => $row['name'],
			"frequency" => $row['frequency'],
        );
        //htmlで出力する場合
        //echo "{$row['id']}:{$row['name']}<br>";
        $i++;
}

$array_all = array( "results" => $array_data);
print json_encode($array_all); // JSON出力


// MySQLへの接続を閉じる
mysql_close($connect) or die("MySQL切断に失敗しました。");
?>