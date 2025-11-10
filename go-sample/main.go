package main // パッケージ宣言（必須）

import (
	"fmt"
	"math/rand"
) // インポート宣言

// 乱数のインポート

func main() { // エントリーポイント
	fmt.Println("Hello, Go!")

	// 問題1.1 配列 randoms に適当な数字 (0～99) を10個設定する
	var randoms = make([]int, 10)
	for i := 0; i < len(randoms); i++ {
		randoms[i] = rand.Intn(100)
	}
	fmt.Println("問題1.1 配列 randoms に適当な数字 (0～99) を10個設定する")
	fmt.Println("randoms:", randoms)

	// 問題1.2 配列 input に適当な数字 (0～99) を3個設定する
	var input = make([]int, 3)
	for i := 0; i < len(input); i++ {
		input[i] = rand.Intn(100)
	}
	fmt.Println("問題1.2 配列 input に適当な数字 (0～99) を3個設定する")
	fmt.Println("input:", input)

	// 問題1.3 randoms, input の各配列の値と randoms に input の数字が何個含まれているかを出力する
	count := 0
	for _, in := range input {
		for _, r := range randoms {
			if in == r {
				count++
				break
			}
		}
	}
	fmt.Printf("randoms, input の各配列の値と randoms に input の数字が何個含まれているかを出力する")
	fmt.Printf("randoms に input の数字が含まれている数: %d 個\n", count)

	fmt.Println("問題2.1 配列 randoms に適当な数字 (0～99) を10個設定する")
	fmt.Println("randoms2_1:", createRandomArray(10))

	fmt.Println("問題2.2 配列 input に適当な数字 (0～99) を3個設定する")
	fmt.Println("randoms2_2:", createRandomArray(3))

	// 問題3 randoms に input の数字が全部含まれるまで繰り返し処理する
	//       input で randoms に含まれた数字は変えないでOK
	//       繰り返した回数を出力する
	input3 := createRandomArray(3)

	count3 := 0
	var randoms3 []int

	for {
		count3++
		randoms3 = createRandomArray(10)

		if containsAll(randoms, input) {
			break
		}
	}

	fmt.Println("input:", input3)
	fmt.Println("randoms:", randoms3)
	fmt.Printf("randoms に input の数字が全部含まれるまで %d 回かかりました。\n", count)


}

// 問題2 適当な数字 (0～99) を n個設定する関数を作成し使うようにする
func createRandomArray(n int) []int {
	var randoms = make([]int, n)
	for i := 0; i < n; i++ {
		randoms[i] = rand.Intn(100)
	}
	return randoms
}

// randoms に input の要素がすべて含まれているかチェックする関数
func containsAll(randoms, input []int) bool {
	for _, in := range input {
		found := false
		for _, r := range randoms {
			if in == r {
				found = true
				break
			}
		}
		if !found {
			return false
		}
	}
	return true
}
