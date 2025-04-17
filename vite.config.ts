// vite.config.ts
import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig(({ command, mode }) => {
    if (command === "serve") {
        return {
            server: {
                host: true,
                port: 8099,
                strictPort: true,
                hmr: {
                    clientPort: 8099,
                },
                headers: {
                    'Cross-Origin-Opener-Policy': 'same-origin',
                    'Cross-Origin-Embedder-Policy': 'require-corp'
                }
            },
            resolve: {
                alias: {
                    // "my-global-script"라는 별칭으로 해당 파일을 참조할 수 있습니다.
                    "global": path.resolve(__dirname, "src/global.ts")
                }
            }
        }
    } else {
        return {
            server: {
                fs: {
                    deny: [".env", ".env.*", "*.{pem, crt}"],
                },
                origin: "*",
            },
            define: {
                'process.env.NODE_ENV': JSON.stringify('production')
            },
            build: {
                lib: {
                  // 라이브러리의 진입점이 될 파일
                  entry: path.resolve(__dirname, 'src/index.ts'),
                  // UMD 빌드 시 전역 변수 이름 (필요 시)
                  name: 'Matrixphere',
                  // ESM, UMD, CJS 등 빌드할 포맷
                  formats: ['es', 'umd', 'cjs'],
                  // 생성될 파일 이름 패턴
                  fileName: (format) => `matrixphere.${format}.js`,
                },
                // 필요한 경우 sourcemap, rollupOptions 등을 지정
                sourcemap: false,
              },
        }
    }
})