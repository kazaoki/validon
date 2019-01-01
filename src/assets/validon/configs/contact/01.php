<?php

# Validon設定
$_VALIDON_ENV['NOTICE'] = false;
$_VALIDON_ENV['BEFORE'] = function($key, &$params, &$errors){ error_log('<<< BEFORE >>>'); };
$_VALIDON_ENV['AFTER'] = function($key, &$params, &$errors){ error_log('<<< AFTER >>>'); };

/**
 * お名前
 */
$_VALIDON['name'] = function(&$params, &$errors){
    if(!strlen($params['name'])) {
        $errors['name'] = '必須項目です。';
    }
};

/**
 * 年齢
 */
$_VALIDON['age'] = function(&$params, &$errors){
    if(!strlen($params['age'])) {
        $errors['age'] = '必須項目です。';
    }
};

/**
 * サイズ
 */
$_VALIDON['size[]'] = function(&$params, &$errors){
    if(!strlen($params['size[]'])) {
        $errors['size[]'] = '必須項目です。';
    }
};

/**
 * XXX
 */
$_VALIDON['全角キーもOK'] = function(&$params, &$errors){
    if(!strlen($params['全角キーもOK'])) {
        $errors['全角キーもOK'] = '必須項目です。';
        $params['全角キーもOK'] = 'あわわ';
    }
};
