<?php

/**
 * お名前
 */
$_VALIDON['name'] = function($params, $validated){
    if(!strlen($params['name'])) {
        $validated['errors']['name'] = '必須項目です。';
    }
    return $validated;
};

/**
 * 年齢
 */
$_VALIDON['age'] = function($params, $validated){
    if(!strlen($params['size[]'])) {
        $validated['errors']['size[]'] = '必須項目です。';
    }
    return $validated;
};

/**
 * サイズ
 */
$_VALIDON['size[]'] = function($params, $validated){
    if(!strlen($params['size[]'])) {
        $validated['errors']['size[]'] = '必須項目です。';
    }
    return $validated;
};

/**
 * XXX
 */
$_VALIDON['全角キーもOK'] = function($params, $validated){
    if(!strlen($params['全角キーもOK'])) {
        $validated['errors']['全角キーもOK'] = '必須項目です。';
        $validated['changes']['全角キーもOK'] = 'あわわ';
    }
    return $validated;
};
