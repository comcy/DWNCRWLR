import { DisplayProcessor, SpecReporter } from "jasmine-spec-reporter";
import SuiteInfo = jasmine.SuiteInfo;

class CustomProcessor extends DisplayProcessor {
    public displayJasmineStarted(info: SuiteInfo, log: string): string {
        return `TypeScript ${log}`;
    }
}

jasmine.getEnv().clearReporters();
jasmine.getEnv().addReporter(new SpecReporter({
    customProcessors: [CustomProcessor],
}));

var reporters = require('jasmine-reporters');
var junitReporter = new reporters.JUnitXmlReporter({
    savePath: 'spec/reports',
    consolidateAll: true,
    filePrefix: 'spec-results'
});
jasmine.getEnv().addReporter(junitReporter)