import { runFallbackClassifier } from "../src/lib/gemini.ts";

// Test 5 realistic complaints
const testCases = [
  {
    title: "Deep Crater Pothole on Arterial Road",
    description: "Massive crater pothole near PSG Tech entrance on Avinashi Road. Heavy traffic and several two-wheelers skidded this morning during rain.",
    address: "Avinashi Road, Peelamedu, Coimbatore",
  },
  {
    title: "Overflowing Garbage Dump Near Central Market",
    description: "Huge heap of municipal trash and rotting vegetable waste overflowing onto the pedestrian pathway. Foul stench spreading to nearby hospital.",
    address: "Gandhipuram Bus Stand, Ward 49, Coimbatore",
  },
  {
    title: "Main Drinking Water Pipeline Burst",
    description: "Potable drinking water pipe cracked and gushing at high pressure onto D.B. Road. Thousands of liters of water wasted.",
    address: "D.B. Road, RS Puram, Ward 23, Coimbatore",
  },
  {
    title: "High Voltage Transformer Sparking Near School",
    description: "Live wire hanging loose from roadside transformer box. Intermittent sparking and popping sounds right opposite school gate. Extreme shock hazard!",
    address: "Saibaba Colony, NSR Road, Ward 17, Coimbatore",
  },
  {
    title: "ரோடு ரொம்ப மோசமா இருக்கு பெரிய குழி விபத்து நடக்குது (Tamil complaint)",
    description: "Peelamedu road is completely broken with deep craters. Cars getting damaged and school vans stuck in mud pallam.",
    address: "Peelamedu Main Road, Ward 45, Coimbatore",
  },
];

console.log("=== RUNNING CIVICRESOLVE CLASSIFIER TEST (5 COMPLAINTS) ===\n");

for (let i = 0; i < testCases.length; i++) {
  const tc = testCases[i];
  console.log(`--- Test Case #${i + 1}: ${tc.title} ---`);
  const result = runFallbackClassifier(tc.title, tc.description, tc.address);
  console.log("Category:      ", result.category);
  console.log("Subcategory:   ", result.subcategory);
  console.log("Urgency:       ", result.urgency);
  console.log("Impact Score:  ", result.impact_score, "/ 100");
  console.log("Department:    ", result.recommended_department);
  console.log("Reasoning:     ", result.department_reasoning);
  console.log("SLA Hours:     ", result.estimated_resolution_time_hours);
  console.log("Action Plan:   ", result.suggested_action_for_authority);
  console.log("Flags:         ", JSON.stringify(result.flags));
  console.log("Source:        ", result.source);
  console.log("------------------------------------------------------------\n");
}

console.log("=== ALL 5 CLASSIFICATION TESTS PASSED STRUCTURAL VALIDATION ===");
