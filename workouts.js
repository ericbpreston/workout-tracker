const WORKOUTS = {
    monday: {
        title: "Monday",
        subtitle: "Lower A",
        focus: "Leg Strength, Rotational Core & Grip",
        blocks: [
            {
                name: "Warmup",
                type: "warmup",
                exercises: [
                    { id: "mon-warmup-1", name: "Cardio", sets: "3 min", reps: null, weight: null, note: "Rowing or Air Bike" },
                    { id: "mon-warmup-2", name: "CARS", sets: "—", reps: null, weight: null, note: "Spinal, Hip (internal rotation), Knee, Ankle" }
                ]
            },
            {
                name: "Block 1: Primary Strength",
                exercises: [
                    { 
                        id: "mon-1a", 
                        name: "1A. Seated Single Leg Press", 
                        sets: "3 sets", 
                        targetReps: "8-10",
                        why: "Builds unilateral leg strength safely without compressing the spine before golf/skiing.",
                        technique: "Keep your lower back glued to the pad. Do not let your hips lift off."
                    },
                    { 
                        id: "mon-1b", 
                        name: "1B. Single Leg Calf Raise (Leg Press)", 
                        sets: "3 sets", 
                        targetReps: "15-20",
                        why: "Corrects calf imbalances.",
                        technique: "Pause for 2 full seconds at the bottom to eliminate the bounce."
                    }
                ]
            },
            {
                name: "Block 2: Stability & Calves",
                exercises: [
                    { 
                        id: "mon-2a", 
                        name: "2A. Zercher Reverse Lunge", 
                        sets: "3 sets", 
                        targetReps: "8-10 each",
                        why: "Holding the weight in the elbows forces the upper back to stay rigid—crucial for maintaining posture in a swing.",
                        technique: "Wrap a towel around the bar if it hurts your arms. Keep elbows high."
                    },
                    { 
                        id: "mon-2b", 
                        name: "2B. SL RDL (Romanian Deadlift)", 
                        sets: "3 sets", 
                        targetReps: "8-10",
                        why: "Builds the glute/hamstring 'brake' system for your swing and taxes your grip heavily.",
                        technique: "No straps. Push hips back until you feel a deep stretch. Keep bar close to your shins."
                    }
                ]
            },
            {
                name: "Block 3: Core Power (Golf Block)",
                exercises: [
                    { 
                        id: "mon-3a", 
                        name: "3A. Pallof Press (Cable/Band)", 
                        sets: "3 sets", 
                        targetReps: "12",
                        why: "'Anti-rotation.' Teaches your core to resist twisting forces, protecting your lower back.",
                        technique: "Stand perpendicular to cable. Press handle out from chest and hold for 2 seconds. Resist the pull."
                    },
                    { 
                        id: "mon-3b", 
                        name: "3B. Leg Extension", 
                        sets: "2 sets", 
                        targetReps: "failure",
                        why: "Simple, safe volume for quad hypertrophy to finish the legs.",
                        technique: "Controlled tempo. Squeeze hard at the top."
                    },
                    { 
                        id: "mon-3c", 
                        name: "3C. Adductor/Outer Thigh Machine (Optional)", 
                        sets: "2 sets", 
                        targetReps: "12-15",
                        why: "Additional inner/outer thigh work.",
                        technique: "Controlled movement through full range."
                    }
                ]
            }
        ]
    },
    tuesday: {
        title: "Tuesday",
        subtitle: "Upper A",
        focus: "Back Strength & Elbow Health",
        blocks: [
            {
                name: "Warmup",
                type: "warmup",
                exercises: [
                    { id: "tue-warmup-1", name: "Cardio", sets: "3 min", reps: null, weight: null, note: "Jump rope or Jacks" },
                    { id: "tue-warmup-2", name: "CARS", sets: "—", reps: null, weight: null, note: "Spinal (Global flexion/extension), Scapula, Shoulder, Neck" }
                ]
            },
            {
                name: "Block 1: Posture & Chest",
                exercises: [
                    { 
                        id: "tue-1a", 
                        name: "1A. Bent Over Barbell Row", 
                        sets: "3 sets", 
                        targetReps: "8-10",
                        why: "Unsupported rows force your core to stabilize a load, translating better to sport than machine rows.",
                        technique: "Hinge at hips until torso is near parallel to floor. Pull bar to belly button."
                    },
                    { 
                        id: "tue-1b", 
                        name: "1B. Incline DB Bench Press", 
                        sets: "3 sets", 
                        targetReps: "8-10",
                        why: "Best angle for upper chest and front shoulder development.",
                        technique: "Tuck elbows slightly (45-degree angle). Don't flare them wide."
                    }
                ]
            },
            {
                name: "Block 2: Vertical Angles",
                exercises: [
                    { 
                        id: "tue-2a", 
                        name: "2A. Standing Military Press", 
                        sets: "3 sets", 
                        targetReps: "8-10",
                        why: "Vertical pressing builds the 'yoke' (traps/shoulders) and requires significant core stability.",
                        technique: "Squeeze glutes hard to protect your lower back while pressing overhead."
                    },
                    { 
                        id: "tue-2b", 
                        name: "2B. Pull Up (or Eccentric Lowering)", 
                        sets: "3 sets", 
                        targetReps: "AMRAP",
                        why: "The king of back width.",
                        technique: "If you can't do full reps, jump up and lower yourself as slowly as possible (5-8 seconds)."
                    }
                ]
            },
            {
                name: "Block 3: Physique & Forearms",
                exercises: [
                    { 
                        id: "tue-3a", 
                        name: "3A. DB Lateral Raise", 
                        sets: "3 sets", 
                        targetReps: "12-15",
                        why: "Essential for shoulder width (side delts).",
                        technique: "Lead with your elbows, like you are pouring out a pitcher of water."
                    },
                    { 
                        id: "tue-3b", 
                        name: "3B. Cable Tricep Pushdown (Rope)", 
                        sets: "3 sets", 
                        targetReps: "12-15",
                        why: "Isolates the tricep for arm size.",
                        technique: "Pull the rope handles apart at the bottom of the movement."
                    },
                    { 
                        id: "tue-3c", 
                        name: "3C. Zottman Curls", 
                        sets: "3 sets", 
                        targetReps: "10-12",
                        why: "Curls up for biceps, lowers down for forearm extensors. Prevents Golfer's Elbow.",
                        technique: "Palms up on the way up. Rotate hands at the top. Palms down (pronated) on the way down."
                    }
                ]
            }
        ]
    },
    thursday: {
        title: "Thursday",
        subtitle: "Lower B",
        focus: "Glute Power, Soleus & Asymmetrical Core",
        blocks: [
            {
                name: "Warmup",
                type: "warmup",
                exercises: [
                    { id: "thu-warmup-1", name: "Cardio", sets: "3 min", reps: null, weight: null, note: "Rowing" },
                    { id: "thu-warmup-2", name: "CARS", sets: "—", reps: null, weight: null, note: "Spinal (Cat/Cow motion), Hip, Ankle (Crucial for squat depth)" }
                ]
            },
            {
                name: "Block 1: The Power Base",
                exercises: [
                    { 
                        id: "thu-1a", 
                        name: "1A. Hip Thrust", 
                        sets: "3 sets", 
                        targetReps: "10-12",
                        why: "Glutes are the engine of a golf swing. Stronger glutes = faster clubhead speed.",
                        technique: "Keep chin tucked. Drive through heels. Squeeze glutes at the top."
                    },
                    { 
                        id: "thu-1b", 
                        name: "1B. Goblet Squat", 
                        sets: "3 sets", 
                        targetReps: "10-12",
                        why: "Front-loaded weight forces thoracic extension (upper back straightness), correcting 'desk posture.'",
                        technique: "Hold DB tight to chest. Elbows inside knees at the bottom."
                    }
                ]
            },
            {
                name: "Block 2: Inner Thigh & Soleus",
                exercises: [
                    { 
                        id: "thu-2a", 
                        name: "2A. Seated DB Calf Raise", 
                        sets: "3 sets", 
                        targetReps: "15-20",
                        why: "Targets the Soleus muscle (gives the lower leg width).",
                        technique: "Sit on bench, place toes on a plate/block. Place heavy DBs vertically on your knees. Drop heels low."
                    },
                    { 
                        id: "thu-2b", 
                        name: "2B. Copenhagen Plank (or Adductor Machine)", 
                        sets: "3 sets", 
                        targetReps: "30s / 12 reps",
                        why: "Inner thigh strength stabilizes the knee during the lateral weight shift in golf/skiing.",
                        technique: "Top leg on bench, bottom leg under bench. Lift hips so body is a straight line."
                    }
                ]
            },
            {
                name: "Block 3: Grip & Carry",
                exercises: [
                    { 
                        id: "thu-3a", 
                        name: "3A. Seated Leg Curl", 
                        sets: "3 sets", 
                        targetReps: "12-15",
                        why: "Isolates hamstrings without lower back load.",
                        technique: "Control the eccentric (don't let the weight stack slam down)."
                    },
                    { 
                        id: "thu-3b", 
                        name: "3B. Suitcase Carry", 
                        sets: "3 sets", 
                        targetReps: "40 yds / 45s",
                        why: "Heavy load in one hand only forces the opposite oblique to fire to keep you upright. Great for golf stability.",
                        technique: "Do not lean. Walk perfectly straight. Shoulders level."
                    }
                ]
            }
        ]
    },
    friday: {
        title: "Friday",
        subtitle: "Upper B",
        focus: "Arm Size & Shoulder Health",
        blocks: [
            {
                name: "Warmup",
                type: "warmup",
                exercises: [
                    { id: "fri-warmup-1", name: "Cardio", sets: "3 min", reps: null, weight: null, note: "Light jog/Jacks" },
                    { id: "fri-warmup-2", name: "CARS", sets: "—", reps: null, weight: null, note: "Spinal, Shoulder, Elbow, Wrist (Prep for arm heavy day)" }
                ]
            },
            {
                name: "Block 1: Repetition Strength",
                exercises: [
                    { 
                        id: "fri-1a", 
                        name: "1A. Flat DB Bench Press", 
                        sets: "3 sets", 
                        targetReps: "10-12",
                        why: "Volume work for chest size.",
                        technique: "Full range of motion. Feel the stretch at the bottom."
                    },
                    { 
                        id: "fri-1b", 
                        name: "1B. Kroc Rows", 
                        sets: "3 sets", 
                        targetReps: "15+",
                        why: "High rep heavy rows build a thick upper back and massive grip endurance.",
                        technique: "One hand on bench. Use a heavy DB. It's okay to use a little body momentum, but control the drop."
                    }
                ]
            },
            {
                name: "Block 2: Arm Size",
                exercises: [
                    { 
                        id: "fri-2a", 
                        name: "2A. Overhead Cable Tricep Extension (DB)", 
                        sets: "3 sets", 
                        targetReps: "10-12",
                        why: "Overhead position stretches the long head of the tricep for growth.",
                        technique: "Keep elbows pointing relatively forward, not flared out to the walls."
                    },
                    { 
                        id: "fri-2b", 
                        name: "2B. Face Pulls", 
                        sets: "3 sets", 
                        targetReps: "15",
                        why: "Rotator cuff health and rear delt activation. Keeps shoulders pulled back.",
                        technique: "Pull towards forehead, separate hands at the end."
                    }
                ]
            },
            {
                name: "Block 3: Prehab & Detail",
                exercises: [
                    { 
                        id: "fri-3a", 
                        name: "3A. Hammer Curls", 
                        sets: "3 sets", 
                        targetReps: "10-12",
                        why: "Hits the Brachialis (side of arm) and forearm.",
                        technique: "Thumbs up the whole time. Keep elbows pinned to ribs."
                    },
                    { 
                        id: "fri-3b", 
                        name: "3B. DB Lateral Raise", 
                        sets: "3 sets", 
                        targetReps: "15-20",
                        why: "High volume fatigues the delts without heavy weight stress.",
                        technique: "Constant tension. Don't rest at the bottom."
                    },
                    { 
                        id: "fri-3c", 
                        name: "3C. Dead Hang", 
                        sets: "1 set", 
                        targetReps: "30s",
                        why: "Decompresses spine and improves grip endurance.",
                        technique: "Relax shoulders, let body hang. Breathe."
                    }
                ]
            }
        ]
    }
};
