<?php

/**
 * JSON受信したならJavaScriptからのAjax通信
 */
if('application/json' === @$_SERVER['CONTENT_TYPE']) {
    $json = json_decode(file_get_contents("php://input"), true) ?: [];

    // 指定のバリデート設定をロード
    $configfile = __DIR__.'/configs/'.$json['config'].'.php';
    if(!file_exists($configfile)) throw new Exception('Validon error: not found config file at '.$configfile);
    require_once $configfile;

    // バリデート実行
    $json = validon($json['params'], $json);

    // 結果JSONを返す
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode($json);

    exit;
}

/**
 * バリデート関数
 *
 * @param Array $params ['name'=>'tarou'] のようなペア配列
 * @param Array $fulldata ajaxから受けたフルのjsonデータの配列化したもの、またはバリデート中に他の要素を参照できるよう全ての値が入る。
 *
 * $result_set = validon($_POST);
 * $result_set = validon(['name'=>'ほげたろう']);
 * $result_set = validon($json['params'], $json);
 *
 * $result_set['params'] ... バリデート済み全パラメータがキー・バリューでセットされてくる
 * $result_set['errors'] ... エラーメッセージがキー・バリューでセットされてくる
 * $result_set['changes'] ... 変更のあるパラメータのキー名のみが配列で入ってくる
 */
function validon(&$params, $fulldata=null)
{
    global $_VALIDON;
    global $_VALIDON_ENV;

    // アップロードファイルが一時アップされている場合はその情報をセット
    foreach($params as $key=>$value) {
        if(array_key_exists($key, $_FILES)) {
            $params[$key] = $_FILES[$key];
        }
    }

    // PHPアップローダのデータ配列を整理する
    if(count($_FILES)) {
        foreach($_FILES as $input_name=>$file) {
            $files = [];
            $keys = array_keys($file);
            $count = count($file['name']);
            if(is_array($file['name'])) {
                for ($i=0; $i<$count; $i++) {
                    foreach ($keys as $key) {
                        $files[$i][$key] = $file[$key][$i];
                    }
                }
                $params[$input_name] = $files;
            } else {
                $params[$input_name] = $file;
            }
        }
    }

    // 変更前値の退避
    $original_params = $params;

    // fulldataが未指定なら第一引数のデータをセットする
    if(!$fulldata) $fulldata = ['params' => $params];

    // 各種処理
    foreach($_VALIDON as $key=>$value) {

        // キーに「[]」がついてたら削除して設定キーとす
        $validonkey = preg_replace('/\[.*\]$/', '', $key);

        // 全ての値をバリデートする前にフック実行
        if(is_callable(@$_VALIDON_ENV['BEFORE'])) {
            $_VALIDON_ENV['BEFORE']($key, $params[$key], $fulldata);
        }

        // バリデート関数が設定ファイルで定義されていればバリデート実行
        if(is_callable(@$_VALIDON[$validonkey])) {
            $error = $_VALIDON[$validonkey]($params[$key], $fulldata);
            if(strlen($error)) $errors[$key] = $error;
        } else {
            if(@$_VALIDON_ENV['NOTICE']) error_log(sprintf('Validon notice: no defined rules "%s"', $validonkey));
        }

        // 全ての値をバリデートした後にフック実行
        if(is_callable(@$_VALIDON_ENV['AFTER'])) {
            $_VALIDON_ENV['AFTER']($key, $params[$key], $fulldata);
        }
    }

    // 値が変更されたキーのみ changes に集計する
    foreach(array_unique(array_merge(array_keys($params), array_keys($original_params))) as $key) {
        if(@$params[$key] !== @$original_params[$key]) {
            $changes[] = $key;
        }
    }

    // 返却
    @$fulldata['params'] = $params;
    @$fulldata['errors'] = @$errors;
    @$fulldata['changes'] = @$changes;

    return $fulldata;
}

/**
 * 日付バリデータ
 */
function __IS_DATE($string)
{
    if(preg_match('/^(\d+)[\-\/](\d+)[\-\/](\d+)$/', $string, $matches)) {
        return checkdate($matches[2], $matches[3], $matches[1]);
    } else {
        return false;
    }
}

/**
 * 時間バリデータ
 */
function __IS_TIME($string)
{
    if(preg_match('/^(\d+)[\:](\d+)$/', $string, $matches)) {
      return (($matches[1]>=0 && $matches[1]<=23) && ($matches[2]>=0 && $matches[2]<=59));
    } else {
        return false;
    }
}

/**
 * URLバリデータ
 */
function __IS_URL($string)
{
    return preg_match('/^https?\:\/\//', $string);
}

/**
 * メールアドレスバリデータ
 */
function __IS_EMAIL($string, $net=false)
{
	$mail_regex1 = '/(?:[-!#-\'*+\/-9=?A-Z^-~]+\.?(?:\.[-!#-\'*+\/-9=?A-Z^-~]+)*|"(?:[!#-\[\]-~]|\\\\[\x09 -~])*")@[-!#-\'*+\/-9=?A-Z^-~]+(?:\.[-!#-\'*+\/-9=?A-Z^-~]+)*/';
	$mail_regex2 = '/^[^\@]+\@[^\@]+$/';
	$error = false;
	if(preg_match($mail_regex1, $string) && preg_match($mail_regex2, $string)) {
		if(preg_match('/[^a-zA-Z0-9\!\"\#\$\%\&\'\(\)\=\~\|\-\^\\\@\[\;\:\]\,\.\/\\\<\>\?\_\`\{\+\*\} ]/', $string)) { $error = true; }
		if( ! preg_match('/\.[a-z]+$/', $string)) { $error = true; }
	} else {
		$error = true;
	}
	if($net){
		$arr = explode('@', $string);
		$host = str_replace(array('[', ']'), '', array_pop($arr));
		if(!(checkdnsrr($host, 'MX') || checkdnsrr($host, 'A') || checkdnsrr($host, 'AAAA'))){
			$error = true;
		}
	}
	return !$error;
}
