use std::fs::File;
use std::io::BufReader;
use std::io::prelude::*;
use std::boxed::Box;
use std::error::Error;
use std::env;

fn main() -> Result<(), Box<(dyn Error + 'static)>> {
    let args: Vec<String> = env::args().collect();
    let file_path = &args[1];

    let f = File::open(file_path)?;
    let f = BufReader::new(f);

    let mut elf_set = vec![0];
    for line_result in f.lines() {
        match line_result.unwrap().as_str() {
            "" => elf_set.push(0),
            line => {
                let running_sum = elf_set.last_mut().ok_or(0).unwrap();
                *(elf_set.last_mut().unwrap()) = *running_sum + line.parse::<i32>().unwrap();
            }
        }
    }
    elf_set.sort();
    println!("largest value: {:?}", &elf_set[elf_set.len()-1..].iter().fold( 0, |acc, item| {
        acc + item
    }));
    println!("three largest values: {:?}", &elf_set[elf_set.len()-3..].iter().fold( 0, |acc, item| {
        acc + item
    }));
    Result::Ok(())
}
