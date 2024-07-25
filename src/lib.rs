use wasm_bindgen::prelude::wasm_bindgen;
use web_sys::console::log_1 as log;

#[wasm_bindgen]
pub fn greet(name: &str) {
    log(&format!("Hello {:?}", name).into());
}
