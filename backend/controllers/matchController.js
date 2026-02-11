import { getSupabase } from "../lib/supabaseClient.js";
import logger from "../utils/logger.js";
import findMatches from "../services/matchmaking/mapper.js";
import { v4 as uuidv4 } from "uuid";

const supabase = getSupabase()

const normalizeInterests = (interestsObj) => {
  if (!interestsObj || typeof interestsObj !== "object") return [];

  return Object.keys(interestsObj)
    .sort((a, b) => Number(a) - Number(b)) // ensure deterministic order
    .map(key => interestsObj[key]);
};

const prepareUser = (profile) => {

  let interestsData = profile.interests;

  // ⭐ FIX: handle stringified JSON
  if (typeof interestsData === "string") {
    try {
      interestsData = JSON.parse(interestsData);
    } catch {
      interestsData = {};
    }
  }


  return {
    id: profile.id,
    firstName: profile.firstName,
    lastName: profile.lastName,
    nickname: profile.nickname ?? null,
    age: profile.age,
    gender: profile.gender?.toLowerCase(),
    gender_preference: profile.gender_preference?.toLowerCase(),

    age_preference: profile.age_preference ?? "any",
    approved: Boolean(profile.approved),
    ismatched: Boolean(profile.ismatched),
    interests: normalizeInterests(interestsData)
  };
};



export const matchUsers = async (req, res) => {
  try {
    logger.info("Matchmaking started");

    /* 1️⃣ Fetch profiles */
    const { data: profiles, error: profileError } = await supabase
      .from("users")
      .select("*");
    logger.info(profiles);
    if (profileError) {
      logger.error("Failed to fetch profiles", { error: profileError.message });
      return res.status(500).json({ error: "Profiles fetch failed" });
    }


    const users = profiles.map(prepareUser);

    console.log("Profile:", users);

    logger.info(`Prepared ${users.length} users for matching`);

    /* 5️⃣ Run Algorithm */
    const result = findMatches(users);
    const matchedPairs = result.matchedPairs

    logger.info("Matchmaking algorithm completed", {
      pairs: result.matchedPairs.length,
    });

    console.log("Algo Result:", result);

    //  /* 6️⃣ Insert Sessions */
    //  if (result.matchedPairs.length  > 0) {
    //  const sessions = result.matchedPairs.map(pair => ({
    //      user_a: pair.user1_id,
    //      user_b: pair.user2_id,
    //      status: "scheduled",
    //      created_at: new Date().toISOString()
    //    }));

    //   const { error: insertError } = await supabase
    //     .from("sessions")
    //      .insert(sessions);

    //    if (insertError) {
    //      logger.error("Failed to create sessions", { error: insertError.message });
    //     return res.status(500).json({ error: "Session insert failed" });
    //   }
    //  }

    logger.info("Matchmaking finished successfully");

    res.json({
      success: true,
      matchedPairs: result.matchedPairs.length
    });
    // ⭐ Insert Sessions AFTER response logic
for (const matches of matchedPairs) {

  const { data: user1 } = await supabase
    .from("users")
    .select("*")
    .eq("id", matches.user1_id)
    .single();

  const { data: user2 } = await supabase
    .from("users")
    .select("*")
    .eq("id", matches.user2_id)
    .single();

  if (!user1 || !user2) {
    logger.warn("User data missing for session creation");
    continue;
  }

  await supabase.from("sessions").insert({
    id: uuidv4(),
    user_a: user1.id,
    user_b: user2.id,
    nickname_a: user1.nickname,
    nickname_b: user2.nickname,
    message_count: 0,
    status: "active",
    start_time: new Date().toISOString(),
    end_time: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
  });
  logger.info(`Session created for users ${user1.nickname} , ${user2.nickname}`)


 await supabase
  .from("users")
  .update({ onboarding_step: "matched" , ismatched:true}) // ⚠️ also check column name
  .eq("id", user1.id);

  await supabase
  .from("users")
  .update({ onboarding_step: "matched" , ismatched:true}) // ⚠️ also check column name
  .eq("id", user2.id);

}




  } catch (err) {
    logger.error("Matchmaking crashed", { error: err.message });
    res.status(500).json({ error: "Internal server error" });
  }
};
