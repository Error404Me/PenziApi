import sql from "mssql";

// Helper function to log query parameters
const logQueryParameters = (params) => {
  console.log("Query Parameters:", params);
};

// Send SMS function
const sendSMS = (to, message) => {
  console.log(`Sending SMS to ${to}: ${message}`);
};

// Service Activation
const activateService = (req, res) => {
  const { from } = req.body;
  console.log(`Activating service for ${from}`);
  sendSMS(
    from,
    "Welcome to our dating service with 6000 potential dating partners! To register SMS start#name#age#gender#county#town to 22141. E.g., start#John Doe#26#Male#Nakuru#Naivasha"
  );
  res.status(200).send("Service activation message sent.");
};

// Register user (POST)
const registerUser = async (req, res) => {
  console.log("my user");
  const { from, payload } = req.body;
  console.log(from, payload);
  const [command, name, age, gender, county, town] = payload.split("#");
  console.log(command, name, age, gender, county, town);
  console.log(`Registering user: ${from} with data: ${payload}`);

  if (command !== "start") {
    console.log(`Invalid command received: ${command}`);
    return res.status(400).send("Invalid Command.");
  }

  try {
    const query = `
      INSERT INTO users (phone, name, age, gender, county, town) 
      VALUES (@phone, @name, @age, @gender, @county, @town)`;

    const request = new sql.Request();
    request.input("phone", sql.VarChar, from);
    request.input("name", sql.VarChar, name);
    request.input("age", sql.Int, parseInt(age)); 
    request.input("gender", sql.VarChar, gender);
    request.input("county", sql.VarChar, county);
    request.input("town", sql.VarChar, town);

    // Log the query parameters
    logQueryParameters({
      phone: from,
      name: name,
      age: age,
      gender: gender,
      county: county,
      town: town,
    });

    await request.query(query);

    console.log(`User ${name} registered successfully.`);
    sendSMS(
      from,
      "User registered and details request message sent."
    );
    res
      .status(200)
      .send( `Your profile has been created successfully ${name}. SMS details#levelOfEducation#profession#maritalStatus#religion#ethnicity to 22141. E.g., details#diploma#driver#single#christian#mijikenda`);
  } catch (err) {
    console.error("Error registering user.");
    res.status(500).send("Error registering user:", err);
  }
};

// Details Registration
// Details Registration
const registerDetails = async (req, res) => {
    const { from, body } = req.body;
    const [
      command,
      levelOfEducation,
      profession,
      maritalStatus,
      religion,
      ethnicity,
    ] = body.split("#");
  
    console.log(`Registering details for ${from}: ${body}`);
  
    if (command !== "details") {
      console.log("Invalid command.");
      return res.status(400).send(`Invalid command received: ${command}`);
    }
  
    try {
      // this one Checks if the user exists
      const checkQuery = `SELECT COUNT(*) AS count FROM users WHERE phone = @phone`;
      const checkRequest = new sql.Request();
      checkRequest.input("phone", sql.VarChar, from);
      const checkResult = await checkRequest.query(checkQuery);
      const userExists = checkResult.recordset[0].count > 0;
  
      if (!userExists) {
        console.log("User does not exist.");
        return res.status(400).send(`User with phone number ${from} does not exist.`);
      }
  
      // Update user details
      const query = `
        UPDATE users 
        SET level_of_education = @levelOfEducation, 
            profession = @profession, 
            marital_status = @maritalStatus, 
            religion = @religion, 
            ethnicity = @ethnicity 
        WHERE phone = @phone`;
  
      const request = new sql.Request();
      request.input("levelOfEducation", sql.VarChar, levelOfEducation);
      request.input("profession", sql.VarChar, profession);
      request.input("maritalStatus", sql.VarChar, maritalStatus);
      request.input("religion", sql.VarChar, religion);
      request.input("ethnicity", sql.VarChar, ethnicity);
      request.input("phone", sql.VarChar, from);
  
      // Log the query parameters
      logQueryParameters({
        levelOfEducation: levelOfEducation,
        profession: profession,
        maritalStatus: maritalStatus,
        religion: religion,
        ethnicity: ethnicity,
        phone: from,
      });
  
      await request.query(query);
  
      console.log(`Details for ${from} updated successfully.`);
      sendSMS(
        from,
        "Details registered and self-description request message sent."
      );
      res
        .status(200)
        .send( "This is the last stage of registration. SMS a brief description of yourself to 22141 starting with the word MYSELF. E.g., MYSELF chocolate, lovely, sexy etc.");
    } catch (err) {
      console.error("Error updating details.");
      res.status(500).send("Error updating details:", err);
    }
  };
  

// Self-Description Registration
const registerSelfDescription = async (req, res) => {
  const { from, body } = req.body;
  const [command, description] = body.split("#");

  console.log(`Registering self-description for ${from}: ${body}`);

  if (command !== "MYSELF") {
    console.log("Invalid command.");
    return res.status(400).send(`Invalid command received: ${command}`);
  }

  try {
    const request = new sql.Request();
    request.input("description", sql.VarChar, description);
    request.input("phone", sql.VarChar, from);

    // Log the query parameters
    logQueryParameters({
      description: description,
      phone: from,
    });

    const query = `
            UPDATE users 
            SET description = @description 
            WHERE phone = @phone`;

    await request.query(query);

    console.log(`Self-description for ${from} updated successfully.`);
    sendSMS(
      from,
      "Self-description received and matching request message sent."
    );
    res
      .status(200)
      .send("You are now registered for dating. To search for a MPENZI, SMS match#age#town to 22141 and meet the person of your dreams. E.g., match#23-25#Kisumu");
  } catch (err) {
    console.error("Error updating description.");
    res.status(500).send("Error updating description:", err);
  }
};

// Handle Matching Request
const handleMatchingRequest = (req, res) => {
  const { from, body } = req.body;
  const [command, ageRange, town] = body.split("#");

  console.log(`Handling matching request for ${from}: ${body}`);

  if (command !== "match") {
    console.log("Invalid command.");
    return res.status(400).send(`Invalid command received: ${command}`);
  }

  // Simulate fetching matches
  sendSMS(
    from,
    "Matching request processed."
  );
  res.status(200).send( "We have 32 ladies who match your choice! We will send you details of 3 of them shortly. To get more details about a lady, SMS her number e.g., 0722010203 to 22141");
};

// Handle Subsequent Details
const handleSubsequentDetails = (req, res) => {
  const { from, body } = req.body;
  const [command, number] = body.split("#");

  console.log(`Handling subsequent details request for ${from}: ${body}`);

  if (command !== "NEXT" && command !== "DESCRIBE") {
    console.log("Invalid command.");
    return res.status(400).send(`Invalid command received: ${command}`);
  }

  if (command === "NEXT") {
    sendSMS(
      from,
      "Pamela Nafula aged 26, 0722040506. Maria Mwende aged 28, 0702556677. Keziah Cheptab, aged 28 0708990011. Send NEXT to 22141 to receive details of the remaining 26 ladies"
    );
  } else if (command === "DESCRIBE") {
    sendSMS(
      from,
      "Subsequent details processed."
    );
  }

  res.status(200).send("Maria Mwende aged 28, Nairobi County, Kasarani town, Graduate, Nurse, single, Christian, Kamba. Send DESCRIBE 0702556677 to get more details about Maria.");
};

// Handle User Confirmation
const handleUserConfirmation = (req, res) => {
  const { from, body } = req.body;
  const [command, number] = body.split("#");

  console.log(`Handling user confirmation for ${from}: ${body}`);

  if (command !== "YES") {
    console.log("Invalid command.");
    return res.status(400).send(`Invalid command received: ${command}`);
  }

  // Simulate user details response
  sendSMS(
    from,
    "User confirmation processed."
  );
  res.status(200).send( "Jamal Jalang’o aged 29, Mombasa County, Bamburi town, Graduate, Accountant, divorced, Muslim, Somali. Send DESCRIBE 0722445566 to get more details about Jamal.");
};

// Export functions
export {
  activateService,
  registerUser,
  registerDetails,
  registerSelfDescription,
  handleMatchingRequest,
  handleSubsequentDetails,
  handleUserConfirmation,
};
