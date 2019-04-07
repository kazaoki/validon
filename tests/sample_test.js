Feature('簡易テスト')

Scenario('入力から送信まで', async (I) => {

	// 入力画面
	I.amOnPage('http://localhost')
	I.fillField('age', '20')
	I.click('中')
	I.click('確認画面へ')

	// 確認画面
	I.see('以下の内容に問題がなければ送信してください。')
	I.see('20')
	I.see('中')

	// 完了画面
	I.click('送信する')
	I.see('処理完了です。')
})
