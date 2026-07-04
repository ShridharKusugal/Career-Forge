package com.technocrate.platform.service;

import java.io.*;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.concurrent.TimeUnit;

public class LocalCodeExecutor {

    public static class ExecutionResult {
        private final boolean success;
        private final String stdout;
        private final String stderr;
        private final boolean compilationError;

        public ExecutionResult(boolean success, String stdout, String stderr, boolean compilationError) {
            this.success = success;
            this.stdout = stdout;
            this.stderr = stderr;
            this.compilationError = compilationError;
        }

        public boolean isSuccess() { return success; }
        public String getStdout() { return stdout; }
        public String getStderr() { return stderr; }
        public boolean isCompilationError() { return compilationError; }
    }

    public static ExecutionResult execute(String language, String code, String stdin) {
        switch (language.toLowerCase()) {
            case "python": case "py":       return executePython(code, stdin);
            case "javascript": case "js":   return executeJavaScript(code, stdin);
            case "typescript": case "ts":   return executeTypeScript(code, stdin);
            case "java":                    return executeJava(code, stdin);
            case "cpp": case "c++":         return executeCpp(code, stdin);
            case "c":                       return executeC(code, stdin);
            case "go": case "golang":       return executeGo(code, stdin);
            case "ruby": case "rb":         return executeRuby(code, stdin);
            case "php":                     return executePHP(code, stdin);
            case "kotlin": case "kt":       return executeKotlin(code, stdin);
            case "rust": case "rs":         return executeRust(code, stdin);
            case "swift":                   return executeSwift(code, stdin);
            default:
                return new ExecutionResult(false, "", "Language not supported on this server: " + language, true);
        }
    }

    private static ExecutionResult executeCpp(String code, String stdin) {
        Path tempDir = null;
        try {
            tempDir = Files.createTempDirectory("cf_cpp_");
            Path src = tempDir.resolve("solution.cpp");
            Path bin = tempDir.resolve("solution");
            Files.writeString(src, code);
            ProcessBuilder compilePb = new ProcessBuilder("g++", "-o", bin.toAbsolutePath().toString(), src.toAbsolutePath().toString(), "-std=c++17");
            Process compileProcess = compilePb.start();
            String compileError = new String(compileProcess.getErrorStream().readAllBytes(), StandardCharsets.UTF_8);
            boolean compiled = compileProcess.waitFor(15, TimeUnit.SECONDS);
            if (!compiled || compileProcess.exitValue() != 0)
                return new ExecutionResult(false, "", "Compilation Error:\n" + compileError, true);
            ProcessBuilder runPb = new ProcessBuilder(bin.toAbsolutePath().toString());
            return runProcess(runPb, stdin, 5);
        } catch (Exception e) {
            return new ExecutionResult(false, "", "System Error (C++): " + e.getMessage(), true);
        } finally { cleanDirectory(tempDir); }
    }

    private static ExecutionResult executeC(String code, String stdin) {
        Path tempDir = null;
        try {
            tempDir = Files.createTempDirectory("cf_c_");
            Path src = tempDir.resolve("solution.c");
            Path bin = tempDir.resolve("solution");
            Files.writeString(src, code);
            ProcessBuilder compilePb = new ProcessBuilder("gcc", "-o", bin.toAbsolutePath().toString(), src.toAbsolutePath().toString());
            Process compileProcess = compilePb.start();
            String compileError = new String(compileProcess.getErrorStream().readAllBytes(), StandardCharsets.UTF_8);
            boolean compiled = compileProcess.waitFor(15, TimeUnit.SECONDS);
            if (!compiled || compileProcess.exitValue() != 0)
                return new ExecutionResult(false, "", "Compilation Error:\n" + compileError, true);
            ProcessBuilder runPb = new ProcessBuilder(bin.toAbsolutePath().toString());
            return runProcess(runPb, stdin, 5);
        } catch (Exception e) {
            return new ExecutionResult(false, "", "System Error (C): " + e.getMessage(), true);
        } finally { cleanDirectory(tempDir); }
    }

    private static ExecutionResult executeGo(String code, String stdin) {
        Path tempDir = null;
        try {
            tempDir = Files.createTempDirectory("cf_go_");
            Path file = tempDir.resolve("main.go");
            Files.writeString(file, code);
            ProcessBuilder pb = new ProcessBuilder("go", "run", file.toAbsolutePath().toString());
            return runProcess(pb, stdin, 10);
        } catch (Exception e) {
            return new ExecutionResult(false, "", "System Error (Go): " + e.getMessage(), true);
        } finally { cleanDirectory(tempDir); }
    }

    private static ExecutionResult executeRuby(String code, String stdin) {
        Path tempDir = null;
        try {
            tempDir = Files.createTempDirectory("cf_rb_");
            Path file = tempDir.resolve("solution.rb");
            Files.writeString(file, code);
            ProcessBuilder pb = new ProcessBuilder("ruby", file.toAbsolutePath().toString());
            return runProcess(pb, stdin, 5);
        } catch (Exception e) {
            return new ExecutionResult(false, "", "System Error (Ruby): " + e.getMessage(), true);
        } finally { cleanDirectory(tempDir); }
    }

    private static ExecutionResult executePHP(String code, String stdin) {
        Path tempDir = null;
        try {
            tempDir = Files.createTempDirectory("cf_php_");
            Path file = tempDir.resolve("solution.php");
            Files.writeString(file, code);
            ProcessBuilder pb = new ProcessBuilder("php", file.toAbsolutePath().toString());
            return runProcess(pb, stdin, 5);
        } catch (Exception e) {
            return new ExecutionResult(false, "", "System Error (PHP): " + e.getMessage(), true);
        } finally { cleanDirectory(tempDir); }
    }

    private static ExecutionResult executeKotlin(String code, String stdin) {
        Path tempDir = null;
        try {
            tempDir = Files.createTempDirectory("cf_kt_");
            Path file = tempDir.resolve("solution.kts");
            Files.writeString(file, code);
            ProcessBuilder pb = new ProcessBuilder("kotlinc", "-script", file.toAbsolutePath().toString());
            return runProcess(pb, stdin, 15);
        } catch (Exception e) {
            return new ExecutionResult(false, "", "System Error (Kotlin): " + e.getMessage(), true);
        } finally { cleanDirectory(tempDir); }
    }

    private static ExecutionResult executeRust(String code, String stdin) {
        Path tempDir = null;
        try {
            tempDir = Files.createTempDirectory("cf_rs_");
            Path src = tempDir.resolve("solution.rs");
            Path bin = tempDir.resolve("solution");
            Files.writeString(src, code);
            ProcessBuilder compilePb = new ProcessBuilder("rustc", "-o", bin.toAbsolutePath().toString(), src.toAbsolutePath().toString());
            Process compileProcess = compilePb.start();
            String compileError = new String(compileProcess.getErrorStream().readAllBytes(), StandardCharsets.UTF_8);
            boolean compiled = compileProcess.waitFor(20, TimeUnit.SECONDS);
            if (!compiled || compileProcess.exitValue() != 0)
                return new ExecutionResult(false, "", "Compilation Error:\n" + compileError, true);
            ProcessBuilder runPb = new ProcessBuilder(bin.toAbsolutePath().toString());
            return runProcess(runPb, stdin, 5);
        } catch (Exception e) {
            return new ExecutionResult(false, "", "System Error (Rust): " + e.getMessage(), true);
        } finally { cleanDirectory(tempDir); }
    }

    private static ExecutionResult executeTypeScript(String code, String stdin) {
        Path tempDir = null;
        try {
            tempDir = Files.createTempDirectory("cf_ts_");
            Path file = tempDir.resolve("solution.ts");
            Files.writeString(file, code);
            ProcessBuilder pb = new ProcessBuilder("ts-node", file.toAbsolutePath().toString());
            return runProcess(pb, stdin, 10);
        } catch (Exception e) {
            return new ExecutionResult(false, "", "System Error (TypeScript): " + e.getMessage(), true);
        } finally { cleanDirectory(tempDir); }
    }

    private static ExecutionResult executeSwift(String code, String stdin) {
        Path tempDir = null;
        try {
            tempDir = Files.createTempDirectory("cf_swift_");
            Path file = tempDir.resolve("solution.swift");
            Files.writeString(file, code);
            ProcessBuilder pb = new ProcessBuilder("swift", file.toAbsolutePath().toString());
            return runProcess(pb, stdin, 10);
        } catch (Exception e) {
            return new ExecutionResult(false, "", "System Error (Swift): " + e.getMessage(), true);
        } finally { cleanDirectory(tempDir); }
    }

    private static ExecutionResult executePython(String code, String stdin) {
        Path tempDir = null;
        try {
            tempDir = Files.createTempDirectory("careerforge_py_");
            Path file = tempDir.resolve("solution.py");
            Files.writeString(file, code);

            ProcessBuilder pb = new ProcessBuilder("python", file.toAbsolutePath().toString());
            return runProcess(pb, stdin, 5); // 5 seconds timeout
        } catch (Exception e) {
            return new ExecutionResult(false, "", "System Error: " + e.getMessage(), true);
        } finally {
            cleanDirectory(tempDir);
        }
    }

    private static ExecutionResult executeJavaScript(String code, String stdin) {
        Path tempDir = null;
        try {
            tempDir = Files.createTempDirectory("careerforge_js_");
            Path file = tempDir.resolve("solution.js");
            Files.writeString(file, code);

            ProcessBuilder pb = new ProcessBuilder("node", file.toAbsolutePath().toString());
            return runProcess(pb, stdin, 5); // 5 seconds timeout
        } catch (Exception e) {
            return new ExecutionResult(false, "", "System Error: " + e.getMessage(), true);
        } finally {
            cleanDirectory(tempDir);
        }
    }

    private static ExecutionResult executeJava(String code, String stdin) {
        Path tempDir = null;
        try {
            tempDir = Files.createTempDirectory("careerforge_java_");
            Path file = tempDir.resolve("Solution.java");
            Files.writeString(file, code);

            // 1. Compile Solution.java
            ProcessBuilder compilePb = new ProcessBuilder("javac", "Solution.java");
            compilePb.directory(tempDir.toFile());
            Process compileProcess = compilePb.start();
            
            String compileError = new String(compileProcess.getErrorStream().readAllBytes(), StandardCharsets.UTF_8);
            boolean compiled = compileProcess.waitFor(10, TimeUnit.SECONDS);
            
            if (!compiled || compileProcess.exitValue() != 0) {
                return new ExecutionResult(false, "", "Compilation Error:\n" + compileError, true);
            }

            // 2. Run Solution class
            ProcessBuilder runPb = new ProcessBuilder("java", "-cp", ".", "Solution");
            runPb.directory(tempDir.toFile());
            return runProcess(runPb, stdin, 5); // 5 seconds timeout
        } catch (Exception e) {
            return new ExecutionResult(false, "", "System Error: " + e.getMessage(), true);
        } finally {
            cleanDirectory(tempDir);
        }
    }

    private static ExecutionResult runProcess(ProcessBuilder pb, String stdin, int timeoutSeconds) {
        try {
            Process process = pb.start();

            // Feed inputs to stdin
            if (stdin != null && !stdin.isEmpty()) {
                try (BufferedWriter writer = new BufferedWriter(new OutputStreamWriter(process.getOutputStream(), StandardCharsets.UTF_8))) {
                    writer.write(stdin);
                    writer.flush();
                }
            } else {
                process.getOutputStream().close();
            }

            // Read output stream asynchronously (to prevent blocking)
            StreamGobbler outGobbler = new StreamGobbler(process.getInputStream());
            StreamGobbler errGobbler = new StreamGobbler(process.getErrorStream());
            outGobbler.start();
            errGobbler.start();

            boolean finished = process.waitFor(timeoutSeconds, TimeUnit.SECONDS);
            if (!finished) {
                process.destroyForcibly();
                outGobbler.join(1000);
                errGobbler.join(1000);
                return new ExecutionResult(false, outGobbler.getResult(), "Execution Timeout: Code took too long to execute.", false);
            }

            outGobbler.join(1000);
            errGobbler.join(1000);

            int exitCode = process.exitValue();
            if (exitCode != 0) {
                return new ExecutionResult(false, outGobbler.getResult(), errGobbler.getResult(), false);
            }

            return new ExecutionResult(true, outGobbler.getResult(), errGobbler.getResult(), false);
        } catch (Exception e) {
            return new ExecutionResult(false, "", "System Execution Error: " + e.getMessage(), true);
        }
    }

    private static void cleanDirectory(Path path) {
        if (path == null) return;
        try {
            File dir = path.toFile();
            if (dir.exists()) {
                File[] files = dir.listFiles();
                if (files != null) {
                    for (File f : files) {
                        f.delete();
                    }
                }
                dir.delete();
            }
        } catch (Exception e) {
            // Ignore clean up errors
        }
    }

    private static class StreamGobbler extends Thread {
        private final InputStream is;
        private final ByteArrayOutputStream bos = new ByteArrayOutputStream();

        public StreamGobbler(InputStream is) {
            this.is = is;
        }

        @Override
        public void run() {
            try (BufferedInputStream bis = new BufferedInputStream(is)) {
                byte[] buffer = new byte[1024];
                int bytesRead;
                while ((bytesRead = bis.read(buffer)) != -1) {
                    bos.write(buffer, 0, bytesRead);
                }
            } catch (IOException e) {
                // Ignore stream read errors
            }
        }

        public String getResult() {
            return bos.toString(StandardCharsets.UTF_8);
        }
    }
}
