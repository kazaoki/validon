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
};

/**
 * サイズ
 */
$_VALIDON['size[]'] = function(&$param, &$data=null){
    if(!strlen($param)) {
        return '必須項目です。';
    }
};

/**
 * XXX
 */
$_VALIDON['全角キーもOK'] = function(&$param, &$data=null){
    if(!strlen($param)) {
        return '必須項目です。';
    }
};
