class Intel86Emulator {
    constructor(memorySizeInBytes = 1024) {
        // Create system memory (RAM)
        this.memory = new Uint8Array(memorySizeInBytes);
        
        // 32-bit registers (EAX, EBX, ECX, EDX)
        this.registers = {
            eax: 0,
            ebx: 0,
            ecx: 0,
            edx: 0,
            eip: 0 // Instruction Pointer (program counter)
        };
        
        this.isHalted = false;
    }

    // Load an array of machine code bytes into RAM at address 0x00
    loadProgram(binaryArray) {
        this.memory.set(binaryArray, 0);
        this.registers.eip = 0;
        this.isHalted = false;
    }

    // Read the next byte from memory and advance the Instruction Pointer
    fetch() {
        if (this.registers.eip >= this.memory.length) {
            this.isHalted = true;
            return 0;
        }
        const byte = this.memory[this.registers.eip];
        this.registers.eip++;
        return byte;
    }

    // Read a 32-bit little-endian integer from memory (used for immediate values)
    fetch32() {
        const b1 = this.fetch();
        const b2 = this.fetch();
        const b3 = this.fetch();
        const b4 = this.fetch();
        return b1 | (b2 << 8) | (b3 << 16) | (b4 << 24);
    }

    // Run a single CPU cycle (Fetch -> Decode -> Execute)
    step() {
        if (this.isHalted) return;

        const opcode = this.fetch();

        switch (opcode) {
            case 0x90: 
                // NOP (No Operation)
                console.log("Executed: NOP");
                break;

            case 0xB8: 
                // MOV EAX, imm32 (Move 32-bit immediate value into EAX)
                const value = this.fetch32();
                this.registers.eax = value;
                console.log(`Executed: MOV EAX, ${value}`);
                break;

            case 0x01: 
                // ADD EAX, EBX (Simplified standard instruction)
                this.registers.eax += this.registers.ebx;
                console.log(`Executed: ADD EAX, EBX (Result: ${this.registers.eax})`);
                break;

            case 0xF4: 
                // HLT (Halt execution)
                this.isHalted = true;
                console.log("Executed: HLT (System Halted)");
                break;

            default:
                console.error(`Unknown Opcode: 0x${opcode.toString(16).toUpperCase()}. Halting.`);
                this.isHalted = true;
                break;
        }
    }
}
