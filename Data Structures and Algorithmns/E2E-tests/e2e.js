// Step 1: Think like a user

// 1. User logs in
// 2. User goes to profile page
// 3. User clicks "Edit"
// 4. User changes mobile number
// 5. User clicks "Save"
// 6. User sees updated number

// Step 2: Create the skeleton

flowTest("user can update mobile phone number", async ({ testUserEmail, dashboard }) => {

  // Step 3: Add a setup (Arrange)

  const initialProfile = {
    first_name: "John",
    last_name: "Doe",
    mobile_number: "1111111111",
  };

  await dashboard.loginAsUser(testUserEmail, {explicitProfile: initialProfile});

  // Step 4: Navigate (Act)

  const profilePage = await dashboard.profilePage.goto();

  // Step 5: Simulate user actions
  const editPanel = await profilePage.profilePage.openEditPanel();

  const newPhone = "2222222222";
  await editPanel.fill("Mobile Phone", newPhone);
  
  await editPanel.save();

  // Step 6: Add assertions (Assert)

  await profilePage.profileData.expectDatum("Mobile Phone", newPhone);

})