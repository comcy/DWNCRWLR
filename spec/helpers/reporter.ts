import { DisplayProcessor, SpecReporter } from "jasmine-spec-reporter";
import SuiteInfo = jasmine.SuiteInfo;
import * as reporters from "jasmine-reporters";


const junitReporter = new reporters.JUnitXmlReporter({
    savePath: "spec/reports",
    consolidateAll: true,
    filePrefix: "zimt-utilities-results"
});

class CustomProcessor extends DisplayProcessor {
    public displayJasmineStarted(info: SuiteInfo, log: string): string {
        return `TypeScript ${log}`;
    }
}

jasmine.getEnv().clearReporters();
jasmine.getEnv().addReporter(
    new SpecReporter({
        customProcessors: [CustomProcessor]
    })
);
jasmine.getEnv().addReporter(junitReporter);
