# Comprehensive AI Prompt for Cryptography Workbench

**Copy and paste the text below to your AI assistant (or back to me) when you are ready to start building the application:**

***

**Role:** You are an Expert Cryptography Professor and Senior Full-Stack Web Developer. 

**Task:** I need you to build a comprehensive, interactive "Security Workbench" web application. This application must correctly solve and visualize 43 specific cryptography problems spanning Classical Ciphers, Number Theory, DES, AES, and Public Key Cryptography (DSA/RSA/ElGamal).

**Tech Stack:**
*   **Frontend:** Vite + React (or vanilla HTML/JS/CSS if preferred), using TailwindCSS for modern, beautiful styling.
*   **Design:** The app MUST look premium, interactive, and academic. Use dark mode with vibrant neon accents (green/blue for math, red for attacks). Use modern typography. 
*   **Architecture:** Use a modular approach. Each topic (Caesar, DES, AES, RSA, etc.) should be its own isolated module/component to keep the codebase maintainable.

**Core Requirements:**
1.  **100% Accuracy:** The application must accurately implement the mathematical logic for the 43 problems listed below. It is not enough to just compute the final answer; for algorithms like DES and AES, the application must be able to output the intermediate states (e.g., Round Keys, S-Box outputs, ShiftRows, MixColumns).
2.  **Interactive Forms:** For each problem, implement a clean UI form where the user can input the variables (e.g., $M$, $K$, $n$, $e$, $p$, $q$) and see the calculated output.
3.  **Step-by-Step Visualization (The "Workbench" aspect):** Do not just spit out the answer. If the problem asks for the Extended Euclidean Algorithm, show the table of steps. If it asks for a DES round, show the Left and Right halves and the output of the F-function. This is a learning tool for a university course.

**The Context & Theory:**
The UI should briefly explain the concepts of:
*   Classical vs Modern Cryptography
*   Absolute Security vs Computational Security
*   Brute-force vs Cryptanalysis
*   Symmetric vs Asymmetric encryption models

**The Problem Set (To be implemented):**
*(AI: Parse the following problems and build solvers for each)*

### 1. CLASSICAL CIPHERS
1.  **Caesar:** Encrypt $M = SAVEFORARAINYDAY$, $K = 25$
2.  **Vigenere (Repeating Key):** Encrypt $M = WHENINROMEDO$, $K = THETRU$
3.  **Vigenere (Autokey):** Encrypt $M = BARKINGDOGSS$, $K = LIKEFA$
4.  **Monoalphabetic Substitution:** Encrypt $M = PENNYWISEPOUNDFO$, $K = KGOXPMUHCAYTJQWZRIVESFLDNB$
5.  **Playfair Matrix:** Encrypt $M = STILLWATERSR$, $K = SAVEFORA$
6.  **Permutation Cipher:** Encrypt $M = TIMEISMONEYTIMEISM$, $K = 5$

### 2. NUMBER THEORY AND MODULAR ARITHMETIC
1.  **Modular Exponentiation (Fast Powering / Hạ bậc):** $b = a^m \pmod n$ -> $a = 499, m = 6337, n = 6337$
2.  **Modular Inverse (Extended Euclidean):** $x = a^{-1} \pmod n$ -> $a = 2705, n = 6577$
3.  **Fermat's Little Theorem:** $b = a^m \pmod n$ -> $a = 281, m = 764, n = 6967$
4.  **Euler's Totient Function $\phi(n)$:** $n = 2863$
5.  **Euler's Theorem:** $b = a^m \pmod n$ -> $a = 27, m = 2201, n = 5400$
6.  **Chinese Remainder Theorem (Exponentiation):** $b = a^k \pmod n$ -> $a = 101, k = 76, n = 49913$
7.  **Chinese Remainder Theorem (System of equations):** $x \pmod{11}=6$, $x \pmod{13}=2$, $x \pmod{17}=4$
8.  **Primitive Root Check:** Is $a=11$ a primitive root of $n=293$?
9.  **Discrete Logarithm:** Find $k = \log_a(b) \pmod n$ -> $a=3, b=8, n=19$
10. **Basic Modulo Expressions:** $a=83, b=17, x=354, y=314, n=241$. Calculate $(ax+by)\pmod n$, $(ax-by)\pmod n$, $(ax*by)\pmod n$, $(by)^{-1}\pmod n$, $(ax/by)\pmod n$

### 3. DES ENCRYPTION (Step-by-Step Visualization)
**Inputs:** $K = \text{3FF81CDA5F417784}$, $M = \text{FF1C9CA3596B7D48}$. 
**Goal:** Show intermediate steps leading to $C = \text{C727541BBA49D95D}$
1.  **Key Generation:** Show PC-1 ($C_0, D_0$), left shifts, and PC-2 ($K_1$).
2.  **Initial Permutation (IP):** Show $L_0, R_0$.
3.  **Round 1 Execution:** Show Expansion $E(R_0)$, XOR with $K_1$, S-Box substitution $S(A)$, Permutation $P$, and the final $L_1, R_1$.
4.  **Final IP-1:** Show the transformation of $L_{16}, R_{16}$ into the final ciphertext.

### 4. AES ENCRYPTION (Step-by-Step Visualization)
**Inputs:** $M = \text{18DC9095F9149EDB7323F20E4E462D92}$, $K = \text{CFD61D489E7C48BC46C9F875C1F04E1B}$
1.  **Key Expansion:** Show generation of $w_0$ to $w_3$, RotWord, SubWord, XOR with Rcon, and the resulting $K_1$.
2.  **Initial AddRoundKey:** Show the state matrix.
3.  **Round execution (1 to 9):** Show the state after SubBytes, ShiftRows, MixColumns, and AddRoundKey.
4.  **Final Round (10):** Show state after SubBytes, ShiftRows, and AddRoundKey (No MixColumns).

### 5. PUBLIC KEY CRYPTOGRAPHY
1.  **Diffie-Hellman:** $q=7523, a=5$. Alice $x_A=387$, Bob $x_B=247$. Compute public keys $Y_A, Y_B$ and shared session key $K$.
2.  **RSA (Sign vs Encrypt):** $p=47, q=71, e=61$. Compute $PU, PR$. Show encryption of $M=59$ and exact decryption process. Explain if it's signing or secrecy based on who encrypts.
3.  **ElGamal:** $q=7433, a=3, x_A=341$. Compute public key $Y_A$. Bob encrypts $M=403$ with $k=872$ to get $(C_1, C_2)$. Show Alice's decryption steps.
4.  **DSA Digital Signatures:** $p=47, q=23, h=34$, Alice $x_A=2, k=10$. Compute $Y_A$ and the signature $(r, s)$. Show Bob's verification steps.

**Execution Plan:**
Do not write the whole app at once! Let's do this iteratively. 
**Phase 1:** Set up the basic web app structure (HTML/JS/CSS or framework) and the layout/navigation for the 5 main topics.
**Phase 2:** Implement the logic and UI for "Classical Ciphers". Wait for my feedback.
**Phase 3:** Implement "Number Theory". 
**Phase 4:** Implement DES/AES with the step-by-step visualizations.
**Phase 5:** Implement Asymmetric Cryptography and finalize the UI.

Are you ready to begin Phase 1?
***
