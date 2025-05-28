<?php

global $_VALIDON;
global $_VALIDON_ENV;
mb_language('Japanese');
mb_internal_encoding('utf-8');

/**
 * Validon設定
 */
// 定義がない場合の警告（true:する false:しない）
$_VALIDON_ENV['NOTICE'] = false;
// 自動トリム機能
$_VALIDON_ENV['TRIM'] = true;
// 値ごとの共通事前バリデート
// $_VALIDON_ENV['BEFORE'] = function($key, &$value, &$params, &$errors, &$changes){ error_log('<<< BEFORE >>>'); };
// 値ごとの共通事後バリデート
// $_VALIDON_ENV['AFTER'] = function($key, &$value, &$params, &$errors, &$changes){ error_log('<<< AFTER >>>'); };

/**
 * お名前
 */
$_VALIDON['name'] = function(&$value, &$params, &$errors, &$changes)
{
    // 条件
    if(!strlen((string)$value)) return '必須項目です。';
    if(mb_strlen((string)$value) > 32) return '32文字以内で入力してください。';
};

/**
 * カナ
 */
$_VALIDON['kana'] = function(&$value, &$params, &$errors, &$changes)
{
    // 全角ひらがなを全角カタカナに変換
    $value = mb_convert_kana($value, 'C');

    // 条件
    if(!strlen((string)$value)) return '必須項目です。';
    if(mb_strlen((string)$value) > 32) return '32文字以内で入力してください。';
};

/**
 * 年齢
 */
$_VALIDON['age'] = function(&$value, &$params, &$errors, &$changes)
{
    // 全角英数字を半角に変換
    $value = mb_convert_kana($value, 'as');

    // 条件
    if(!strlen((string)$value)) return '必須項目です。';
    if($value<0 || $value>200) return '正しくない値です。';
    if(!ctype_digit($value)) return '数字以外が入力されています。';
};

/**
 * 好きな食べ物（任意）
 */
$_VALIDON['food'] = function(&$value, &$params, &$errors, &$changes)
{
    return;
};

/**
 * 生年月日
 */
$_VALIDON['birth_year'] = function(&$value, &$params, &$errors, &$changes)
{
    if(!__IS_DATE(sprintf('%04d-%02d-%02d', $params['birth_year'], $params['birth_month'], $params['birth_day']))) {
        return '日付まちがってますよ';
    }
};
$_VALIDON['birth_month'] = null;
$_VALIDON['birth_day'] = null;

/**
 * お問い合わせ内容
 */
$_VALIDON['content'] = function(&$value, &$params, &$errors, &$changes)
{
    // 条件
    if(!strlen((string)$value)) return '必須項目です。';
    if(mb_strlen((string)$value) > 255) return '255文字以内で入力してください。（改行も1カウント）';
};

/**
 * サイズ選択（ラジオボタン）
 */
$_VALIDON['size'] = function(&$value, &$params, &$errors, &$changes)
{
    // 条件
    if(!strlen((string)$value)) return '必須項目です。';
};

/**
 * 色選択（チェックボックス）
 */
$_VALIDON['color'] = function(&$values, &$params, &$errors, &$changes)
{
    // 条件
    if(!count($values)) return '必須項目です。';
};

/**
 * プルダウン
 */
$_VALIDON['list'] = function(&$values, &$params, &$errors, &$changes)
{
    // 条件
    if(!strlen((string)implode('', array_values($values)))) return '必須項目です。';
};

/**
 * シングルファイル
 */
$_VALIDON['docfile'] = function(&$value, &$params, &$errors, &$changes)
{
    // 条件
    if(is_array($value)) {
        if($value['size']>1024*1024) return '1MB 超えてるファイルは控えて下さい。';
    }
};

/**
 * マルチファイル
 */
$_VALIDON['picfiles'] = function(&$values, &$params, &$errors, &$changes)
{
    // 条件
    $size_total = 0;
    if(is_array($values)) {
        foreach($values as $value) {
            if(is_array($value)) {
                $size_total += $value['size'];
            }
        }
        if($size_total > 1024*1024) return 'ファイルサイズ合計が 1MB を超えています。';
    }
};

/**
 * キー有り配列（1-5）
 */
$_VALIDON['nums'] = function(&$values, &$params, &$errors, &$changes)
{
    error_log(print_r($values, 1));
    $errors['nums[3]'] = 'さんばんめ';
    $params['nums[3]'] = '書き換えないよう';
    $params['nums[etc][]'] = 'XXX';
};

/**
 * キー有り配列（A-E）
 */
$_VALIDON['alphas'] = function(&$value, &$params, &$errors, &$changes)
{
    error_log(print_r($value, 1));
    return 'ALPHAS!!';
};
