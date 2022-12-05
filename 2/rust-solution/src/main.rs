
use std::fs::File;
use std::io::BufReader;
use std::io::prelude::*;
use std::boxed::Box;
use std::error::Error;

fn main() -> Result<(), Box<(dyn Error + 'static)>> {

    let mut p1score = 0;
    let mut p2score = 0;

    let _ = readInput(|line| {
        match line {
            "A X" => { p1score += 4; p2score += 3; }
            "A Y" => { p1score += 8; p2score += 4; }
            "A Z" => { p1score += 3; p2score += 8; }

            "B X" => { p1score += 1; p2score += 1; }
            "B Y" => { p1score += 5; p2score += 5; }
            "B Z" => { p1score += 9; p2score += 9; }

            "C X" => { p1score += 7; p2score += 2; }
            "C Y" => { p1score += 2; p2score += 6; }
            "C Z" => { p1score += 6; p2score += 7; }
            _ => {}
        }
    });

    println!("P1 score {}", p1score);
    println!("P2 score {}", p2score);

    Result::Ok(())
}

fn readInput<F>(mut handler: F) -> Result<(), std::io::Error>
where
    F: FnMut(&str) -> (),
{
    let f = File::open("../input.txt")?;
    let f = BufReader::new(f);
    for line_result in f.lines() {
        handler(line_result.unwrap().as_str());
    }
    Ok(())
}

