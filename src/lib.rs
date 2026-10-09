use wasm_bindgen::prelude::*;

// Define 64-bit registers
#[derive(Default)]
pub struct Registers {
    pub rax: u64,
    pub rbx: u64,
    pub rcx: u64,
    pub rdx: u64,
    pub rip: u64, // Instruction Pointer
}

#[wasm_bindgen]
pub struct VirtualMachine {
    registers: Registers,
    memory: Vec<u8>,
}

#[wasm_bindgen]
impl VirtualMachine {
    #[wasm_bindgen(constructor)]
    pub fn new(memory_size: usize) -> Self {
        Self {
            registers: Registers::default(),
            memory: vec![0; memory_size],
        }
    }

    // Load binary code into memory
    pub fn load_program(&mut self, program: &[u8]) {
        for (i, &byte) in program.iter().enumerate() {
            if i < self.memory.len() {
                self.memory[i] = byte;
            }
        }
    }

    // A single CPU step (Fetch, Decode, Execute)
    pub fn step(&mut self) {
        let rip = self.registers.rip as usize;
        if rip >= self.memory.len() { return; }

        let opcode = self.memory[rip];
        self.registers.rip += 1;

        match opcode {
            // Example: 0x90 is NOP (No Operation)
            0x90 => {}, 
            
            // Example: Simplified MOV RAX, Immediate (Stub)
            0xB8 => {
                // In real x86-64, you would read the next 8 bytes
                self.registers.rax = 42; 
                self.registers.rip += 8;
            }
            
            _ => panic!("Unknown opcode: {:#X}", opcode),
        }
    }

    pub fn get_rax(&self) -> u64 {
        self.registers.rax
    }
}
