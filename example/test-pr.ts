import { generateGraphqlShield } from '../src/index';
import { typeDefs, resolvers } from './schema';

async function testPRFeatures() {
  console.log('Testing PR functionality...');
  
  // Test 1: Custom rule functionality
  console.log('Testing custom rule override...');
  await generateGraphqlShield({
    schema: { typeDefs, resolvers },
    options: {
      outputDir: './generated',
      fileName: 'shield-customrule',
      extension: 'ts',
      moduleSystem: 'ES modules',
      customrule: 'hasAuth',
      customrulepath: './hasAuth',
    },
  });
  
  // Test 2: Group by objects functionality
  console.log('Testing groupbyobjects...');
  await generateGraphqlShield({
    schema: { typeDefs, resolvers },
    options: {
      outputDir: './generated',
      fileName: 'shield-groupbyobjects',
      extension: 'ts',
      moduleSystem: 'ES modules',
      groupbyobjects: true,
    },
  });
  
  // Test 3: Shield options functionality
  console.log('Testing shieldoptions...');
  await generateGraphqlShield({
    schema: { typeDefs, resolvers },
    options: {
      outputDir: './generated',
      fileName: 'shield-options',
      extension: 'ts',
      moduleSystem: 'ES modules',
      shieldoptions: '{ allowExternalErrors: true }',
    },
  });
  
  // Test 4: All features combined
  console.log('Testing all features combined...');
  await generateGraphqlShield({
    schema: { typeDefs, resolvers },
    options: {
      outputDir: './generated',
      fileName: 'shield-combined',
      extension: 'ts',
      moduleSystem: 'ES modules',
      customrule: 'hasAuth',
      customrulepath: './hasAuth',
      groupbyobjects: true,
      shieldoptions: '{ allowExternalErrors: true }',
    },
  });
  
  console.log('✅ PR functionality tests completed');
}

testPRFeatures().catch(console.error);