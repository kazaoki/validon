<?php

/**
 * Validon設定
 */
// 定義がない場合の警告（true:する false:しない）
$_VALIDON_ENV['NOTICE'] = false;
// 値ごとの共通事前バリデート
// $_VALIDON_ENV['BEFORE'] = function($key, &$param, &$data=null){ error_log('<<< BEFORE >>>'); };
// 値ごとの共通事後バリデート
// $_VALIDON_ENV['AFTER'] = function($key, &$param, &$data=null){ error_log('<<< AFTER >>>'); };

/**
 * お名前
 */
$_VALIDON['name'] = function(&$param, &$data=null){
    if(!strlen($param)) {
        return '必須項目です。';
    }
};

/**
 * 年齢
 */
$_VALIDON['age'] = function(&$param, &$data=null){
    if(!strlen($param)) {
        return '必須項目です。';
    }
    if($param<0 || $param>200) {
        return '正しくない値です。';
    }
    // $param .= '!';
};

/**
 * お問い合わせ内容
 */
$_VALIDON['content'] = function(&$param, &$data=null){
    // $param = preg_replace('/[\r\n]/', '', $param);
    if(!strlen($param)) {
        return '必須項目です。';
    }
};

/**
 * サイズ選択（ラジオボタン）
 */
$_VALIDON['size[]'] = function(&$params, &$data=null){
    if(!count($params)) {
        return '必須項目です。';
    }
};

/**
 * 色選択（チェックボックス）
 */
$_VALIDON['color[]'] = function(&$params, &$data=null){
    // if(!in_array('黄', $params, true)) $params[] = '黄';
    if(!count($params)) {
        return '必須項目です。';
    }
};

/**
 * プルダウン
 */
$_VALIDON['list[]'] = function(&$params, &$data=null){
    // if(!in_array('333', $params, true)) $params[] = '333';
    if(!count($params)) {
        return '必須項目です。';
    }
};
