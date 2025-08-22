import { generateGraphqlShield } from '../src/index';
import { typeDefs, resolvers } from './schema';

async function testAllFixes() {
  console.log('Testing all fixes...\n');
  
  // Test 1: Default behavior (should use 'allow' and no fallback rule)
  console.log('1. Testing default behavior...');
  await generateGraphqlShield({
    schema: { typeDefs, resolvers },
    options: {
      outputDir: './generated',
      fileName: 'shield-default',
      extension: 'ts',
      moduleSystem: 'ES modules',
    },
  });
  
  // Test 2: Custom rule with fallback deny
  console.log('2. Testing custom rule with fallback deny...');
  await generateGraphqlShield({
    schema: { typeDefs, resolvers },
    options: {
      outputDir: './generated',
      fileName: 'shield-custom-deny',
      extension: 'ts',
      moduleSystem: 'ES modules',
      customrule: 'hasAuth',
      customrulepath: './hasAuth',
      fallbackRule: 'deny',
    },
  });
  
  // Test 3: Custom rule with fallback allow
  console.log('3. Testing custom rule with fallback allow...');
  await generateGraphqlShield({
    schema: { typeDefs, resolvers },
    options: {
      outputDir: './generated',
      fileName: 'shield-custom-allow',
      extension: 'ts',
      moduleSystem: 'ES modules',
      customrule: 'hasAuth',
      customrulepath: './hasAuth',
      fallbackRule: 'allow',
    },
  });
  
  // Test 4: No fallback rule
  console.log('4. Testing no fallback rule...');
  await generateGraphqlShield({
    schema: { typeDefs, resolvers },
    options: {
      outputDir: './generated',
      fileName: 'shield-no-fallback',
      extension: 'ts',
      moduleSystem: 'ES modules',
      customrule: 'hasAuth',
      customrulepath: './hasAuth',
      fallbackRule: false,
    },
  });
  
  // Test 5: Group by objects with default order
  console.log('5. Testing groupbyobjects false (default order)...');
  await generateGraphqlShield({
    schema: { typeDefs, resolvers },
    options: {
      outputDir: './generated',
      fileName: 'shield-no-grouping',
      extension: 'ts',
      moduleSystem: 'ES modules',
      groupbyobjects: false,
    },
  });
  
  // Test 6: Group by objects with priority order
  console.log('6. Testing groupbyobjects true (priority order)...');
  await generateGraphqlShield({
    schema: { typeDefs, resolvers },
    options: {
      outputDir: './generated',
      fileName: 'shield-with-grouping',
      extension: 'ts',
      moduleSystem: 'ES modules',
      groupbyobjects: true,
    },
  });
  
  // Test 7: All features combined
  console.log('7. Testing all features combined...');
  await generateGraphqlShield({
    schema: { typeDefs, resolvers },
    options: {
      outputDir: './generated',
      fileName: 'shield-all-features',
      extension: 'ts',
      moduleSystem: 'ES modules',
      customrule: 'hasAuth',
      customrulepath: './hasAuth',
      groupbyobjects: true,
      fallbackRule: 'deny',
      shieldoptions: '{ allowExternalErrors: true }',
    },
  });
  
  // Test 8: CommonJS module system
  console.log('8. Testing CommonJS module system...');
  await generateGraphqlShield({
    schema: { typeDefs, resolvers },
    options: {
      outputDir: './generated',
      fileName: 'shield-commonjs',
      extension: 'js',
      moduleSystem: 'CommonJS',
      customrule: 'hasAuth',
      customrulepath: './hasAuth',
      fallbackRule: 'deny',
    },
  });
  
  console.log('\n✅ All tests completed! Check generated files for results.');
}

testAllFixes().catch(console.error);