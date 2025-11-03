require('dotenv').config();
const { sequelize, testConnection } = require('../config/database');
const Admin = require('../models/Admin');

const defaultAdmins = [
  {
    username: 'klaus_wong',
    password: '1314wang'
  },
  {
    username: 'patrick_cheung',
    password: 'qwuhe761'
  }
];

async function seedAdmins() {
  try {
    // Test database connection
    console.log('🔌 Connecting to database...');
    const connected = await testConnection();
    if (!connected) {
      console.error('❌ Failed to connect to database');
      process.exit(1);
    }

    // Sync database to ensure tables exist
    await sequelize.sync({ alter: false });
    console.log('✅ Database synchronized');

    // Create or update admin accounts
    console.log('\n📝 Creating admin accounts...');
    
    for (const adminData of defaultAdmins) {
      try {
        // Check if admin already exists
        const existingAdmin = await Admin.findOne({ 
          where: { username: adminData.username } 
        });

        if (existingAdmin) {
          // Update password if admin exists
          existingAdmin.password = adminData.password;
          await existingAdmin.save();
          console.log(`✅ Updated admin: ${adminData.username}`);
        } else {
          // Create new admin (password will be hashed by beforeCreate hook)
          await Admin.create({
            username: adminData.username,
            password: adminData.password
          });
          console.log(`✅ Created admin: ${adminData.username}`);
        }
      } catch (error) {
        console.error(`❌ Error processing ${adminData.username}:`, error.message);
      }
    }

    console.log('\n🎉 Admin accounts setup complete!');
    console.log('\n📋 Default Admin Accounts:');
    console.log('   1. Username: klaus_wong, Password: 1314wang');
    console.log('   2. Username: patrick_cheung, Password: qwuhe761');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding admins:', error);
    process.exit(1);
  }
}

// Run the script
seedAdmins();

