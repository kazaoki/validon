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
$_VALIDON['name'] = function(&$param, &$data=null)
{
    // 条件
    if(!strlen($param)) return '必須項目です。';
    if(mb_strlen($param) > 32) return '32文字以内で入力してください。';
};

/**
 * カナ
 */
$_VALIDON['kana'] = function(&$param, &$data=null)
{
    // 全角ひらがなを全角カタカナに変換
    $param = mb_convert_kana($param, 'C');

    // 条件
    if(!strlen($param)) return '必須項目です。';
    if(mb_strlen($param) > 32) return '32文字以内で入力してください。';
};

/**
 * 年齢
 */
$_VALIDON['age'] = function(&$param, &$data=null)
{
    // 全角英数字を半角に変換
    $param = mb_convert_kana($param, 'as');

    // 条件
    if(!strlen($param)) return '必須項目です。';
    if($param<0 || $param>200) return '正しくない値です。';
    if(!ctype_digit($param)) return '数字以外が入力されています。';
};

/**
 * お問い合わせ内容
 */
$_VALIDON['content'] = function(&$param, &$data=null)
{
    // 条件
    if(!strlen($param)) return '必須項目です。';
    if(mb_strlen($param) > 255) return '255文字以内で入力してください。（改行も1カウント）';
};

/**
 * サイズ選択（ラジオボタン）
 */
$_VALIDON['size[]'] = function(&$params, &$data=null)
{
    // 条件
    if(!count($params)) return '必須項目です。';
};

/**
 * 色選択（チェックボックス）
 */
$_VALIDON['color[]'] = function(&$params, &$data=null)
{
    // 条件
    if(!count($params)) return '必須項目です。';
};

/**
 * プルダウン
 */
$_VALIDON['list[]'] = function(&$params, &$data=null)
{
    // 条件
    if(!count($params)) return '必須項目です。';
};
