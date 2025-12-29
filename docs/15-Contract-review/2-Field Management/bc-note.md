

Yes. You're right. Two separate things:

Template (HTML) - has {{placeholders}} - lives in app
Test data file (TS) - has values - lives in repo at northBattlefordTestData.ts

Toggle ON → App reads test data file → Fills template placeholders
Toggle OFF → Empty or user-entered values