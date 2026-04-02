const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient({
  log: ["error", "warn"],
});

async function testDatabaseConnection() {
  console.log("🧪 Starting Database Connection Tests...\n");

  try {
    // Test 1: Test database connection
    console.log("📡 Test 1: Verify Database Connection");
    const userCount = await prisma.user.count();
    console.log(`✅ Database connection successful! Current user count: ${userCount}\n`);

    // Test 2: Create a test user
    console.log("📝 Test 2: Creating Test User");
    const testUser = await prisma.user.create({
      data: {
        email: `test-${Date.now()}@example.com`,
        name: "Test User",
        password: "test_password",
        role: "USER",
      },
    });
    console.log("✅ Test user created:", testUser.id);
    console.log("   Email:", testUser.email);
    console.log("   Name:", testUser.name, "\n");

    // Test 3: Read the test user
    console.log("🔍 Test 3: Fetching Test User");
    const fetchedUser = await prisma.user.findUnique({
      where: { id: testUser.id },
    });
    console.log("✅ User fetched successfully:");
    console.log("   Email:", fetchedUser?.email);
    console.log("   Role:", fetchedUser?.role, "\n");

    // Test 4: Update the test user
    console.log("✏️  Test 4: Updating Test User");
    const updatedUser = await prisma.user.update({
      where: { id: testUser.id },
      data: { name: "Updated Test User" },
    });
    console.log("✅ User updated successfully:");
    console.log("   Name:", updatedUser.name, "\n");

    // Test 5: List all users
    console.log("📋 Test 5: Listing All Users");
    const allUsers = await prisma.user.findMany();
    console.log(`✅ Found ${allUsers.length} user(s) in database\n`);

    // Test 6: Delete the test user
    console.log("🗑️  Test 6: Deleting Test User");
    const deletedUser = await prisma.user.delete({
      where: { id: testUser.id },
    });
    console.log("✅ Test user deleted successfully\n");

    console.log("🎉 All database tests passed!\n");
  } catch (error) {
    console.error("❌ Database test failed:");
    if (error instanceof Error) {
      console.error("   Error:", error.message);
      console.error("   Stack:", error.stack);
    } else {
      console.error("   Unknown error:", error);
    }
    process.exit(1);
  } finally {
    // Disconnect from database
    await prisma.$disconnect();
    console.log("🔌 Database connection closed");
  }
}

// Run the tests
testDatabaseConnection().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});
