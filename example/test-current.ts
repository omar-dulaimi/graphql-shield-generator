import { generateGraphqlShield } from '../src/index';
import { resolvers, typeDefs } from './schema';

async function testCurrent() {
  console.log('Testing current functionality...');
  
  // Test 1: Basic shield generation
  await generateGraphqlShield({
    schema: { typeDefs, resolvers },
    options: {
      outputDir: './generated',
      fileName: 'shield-current',
      extension: 'ts',
      moduleSystem: 'ES modules',
    },
  });
  
  console.log('✅ Current functionality test completed');
}

testCurrent().catch(console.error);