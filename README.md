# Web Assembly using Rust

A png image compression app that compressed image fully locally on browser.

### Building

This project uses `cargo-run-bin` to use `wasm-pack` to build from `Cargo.toml` instead of using it globally. This makes sure there's no any "It works on my machine" drama. So make sure to install [cargo-run-bin](https://crates.io/crates/cargo-run-bin) globally:

```
> cargo install cargo-run-bin

<!-- Initiate local binary  -->
> cargo bin --install
```

You can now compile web-assembly code using:

```
> cargo wasmpack build

<!-- OR -->

> make wasm.build
```
