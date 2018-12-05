// karma.conf.ts
module.exports = (config) => {
    config.set({
        autoWatch: true,
        singleRun: false,
        basePath: '',
        frameworks: ['jasmine'],
        port: 8888,
        client: {
            clearContext: false // leave Jasmine Spec Runner output visible in browser
        },
        plugins: [
            'karma-jasmine',
            'karma-chrome-launcher',
            'karma-typescript',
            'karma-jasmine-html-reporter'
            // 'karma-phantomjs-launcher',
        ],
        karmaTypescriptConfig: {
            compilerOptions: {
                emitDecoratorMetadata: true,
                experimentalDecorators: true,
                module: "commonjs",
                sourceMap: true,
                target: "ES5"
            },
            exclude: ["node_modules"]
        },
        preprocessors: {
            '**/*.ts': 'karma-typescript'
        },
        reporters: [
            'progress',
            'kjhtml'
        ],
        colors: true,
        files: [
            'src/**/*.spec.ts'
        ],
        exclude: [
            'src/',
            'dist/',
            'node_modules/',
            'profile/',
            'publish/',
            'docs',
            'buildtools'
        ],
        logLevel: config.LOG_DEBUG
    });
}