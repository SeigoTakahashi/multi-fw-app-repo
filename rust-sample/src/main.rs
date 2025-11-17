use rand::Rng;

/// -------------------------------------------
/// 定数（要件を変更するときはここだけ変えればOK）
/// -------------------------------------------
const RANDOMS_LEN: usize = 10;  // 問題1
const INPUT_LEN: usize = 3;     // 問題1
const RANGE_MAX: u32 = 100;     // 0〜99（問題1）
/// -------------------------------------------

/// -------------------------------------------
/// 問題4：randoms や input をまとめる構造体
/// -------------------------------------------
struct AppState {
    randoms: Vec<u32>,
    input: Vec<u32>,
}

impl AppState {
    /// -------------------------------------------
    /// 問題2：任意個数のランダム数列を生成する関数
    /// -------------------------------------------
    fn generate_random_numbers(len: usize, max_value: u32) -> Vec<u32> {
        let mut rng = rand::rng();
        (0..len).map(|_| rng.random_range(0..max_value)).collect()
    }

    /// 初期化（問題1の処理をここでまとめる）
    fn new() -> Self {
        let randoms = Self::generate_random_numbers(RANDOMS_LEN, RANGE_MAX);
        let input = Self::generate_random_numbers(INPUT_LEN, RANGE_MAX);
        Self { randoms, input }
    }

    /// randoms に input の値がいくつ含まれるか（問題1）
    fn count_matches(&self) -> usize {
        self.input.iter().filter(|&&v| self.randoms.contains(&v)).count()
    }

    /// randoms が input のすべての数字を含むか確認（問題3）
    fn contains_all_inputs(&self) -> bool {
        self.input.iter().all(|v| self.randoms.contains(v))
    }

    /// -------------------------------------------
    /// 問題3：input の数字が全部 randoms に含まれるまで繰り返す
    /// input は変えず、randoms を再生成
    /// 繰り返した回数を返す
    /// -------------------------------------------
    fn repeat_until_all_match(&mut self) -> usize {
        let mut count = 0;

        while !self.contains_all_inputs() {
            self.randoms = Self::generate_random_numbers(RANDOMS_LEN, RANGE_MAX);
            count += 1;
        }

        count
    }

    /// 出力まとめ（問題1 & 問題3）
    fn print_info(&self, loop_count: usize) {
        println!("randoms      : {:?}", self.randoms);
        println!("input        : {:?}", self.input);
        println!("一致した数    : {}", self.count_matches());
        println!("繰り返した回数: {}", loop_count);
    }
}

/// -------------------------------------------
/// main（問題4：構造体を使ったシンプルな流れ）
/// -------------------------------------------
fn main() {
    // 初期化（問題1 & 問題2）
    let mut app = AppState::new();

    // 問題3：randoms が input の全要素を含むまでループ
    let loop_count = app.repeat_until_all_match();

    // 結果出力
    app.print_info(loop_count);
}
