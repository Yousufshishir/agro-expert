// server/data/crops.js
export const crops = [{
        name: {
            english: "Rice (Boro)",
            bengali: "ধান (বোরো)"
        },
        category: {
            english: "Cereal",
            bengali: "শস্য"
        },
        growingSeason: {
            english: "Winter to Summer (December-May)",
            bengali: "শীত থেকে গ্রীষ্ম (ডিসেম্বর-মে)"
        },
        waterRequirements: {
            english: "High, requires standing water",
            bengali: "অধিক, জল দাঁড়িয়ে থাকা প্রয়োজন"
        },
        soilType: {
            english: "Clay loam soil with good water retention capacity",
            bengali: "ভালো জল ধারণ ক্ষমতা সহ কাদামাটি"
        },
        timeToHarvest: {
            english: "140-150 days",
            bengali: "১৪০-১৫০ দিন"
        },
        fertilizers: {
            english: "Urea, TSP, MoP, Gypsum, Zinc sulfate",
            bengali: "ইউরিয়া, টিএসপি, এমওপি, জিপসাম, জিঙ্ক সালফেট"
        },
        commonDiseases: [{
                name: {
                    english: "Blast",
                    bengali: "ব্লাস্ট"
                },
                treatment: {
                    english: "Use resistant varieties, apply Tricyclazole",
                    bengali: "প্রতিরোধী জাত ব্যবহার করুন, ট্রাইসাইক্লাজোল প্রয়োগ করুন"
                }
            },
            {
                name: {
                    english: "Bacterial Leaf Blight",
                    bengali: "ব্যাকটেরিয়াল লিফ ব্লাইট"
                },
                treatment: {
                    english: "Use resistant varieties, balanced fertilizers",
                    bengali: "প্রতিরোধী জাত ব্যবহার করুন, সুষম সার প্রয়োগ করুন"
                }
            }
        ],
        pestManagement: {
            english: "Use IPM practices, light traps for stem borer, balanced fertilizer application",
            bengali: "আইপিএম পদ্ধতি ব্যবহার করুন, কান্ড ছিদ্রকারী পোকার জন্য আলো ফাঁদ, সুষম সার প্রয়োগ"
        },
        yieldEstimate: {
            english: "5-6 tons/hectare",
            bengali: "৫-৬ টন/হেক্টর"
        },
        marketValue: {
            english: "20-25 BDT/kg",
            bengali: "২০-২৫ টাকা/কেজি"
        },
        tips: {
            english: "Maintain proper irrigation, especially during flowering. Drain field 10 days before harvest.",
            bengali: "ফুল আসার সময় বিশেষ করে সঠিক সেচ বজায় রাখুন। ফসল কাটার ১০ দিন আগে জমি থেকে পানি সরিয়ে ফেলুন।"
        },
        image: "/images/rice.jpg"
    },
    {
        name: {
            english: "Jute",
            bengali: "পাট"
        },
        category: {
            english: "Fiber Crop",
            bengali: "আঁশ ফসল"
        },
        growingSeason: {
            english: "March-April to July-August",
            bengali: "মার্চ-এপ্রিল থেকে জুলাই-আগস্ট"
        },
        waterRequirements: {
            english: "Moderate to high, requires regular rainfall",
            bengali: "মাঝারি থেকে অধিক, নিয়মিত বৃষ্টি প্রয়োজন"
        },
        soilType: {
            english: "Well-drained loamy to clay loam soils",
            bengali: "ভালো নিষ্কাশনযুক্ত দোআঁশ থেকে কাদা দোআঁশ মাটি"
        },
        timeToHarvest: {
            english: "100-120 days",
            bengali: "১০০-১২০ দিন"
        },
        fertilizers: {
            english: "Urea, TSP, MoP, Gypsum",
            bengali: "ইউরিয়া, টিএসপি, এমওপি, জিপসাম"
        },
        commonDiseases: [{
                name: {
                    english: "Stem Rot",
                    bengali: "কান্ড পচা"
                },
                treatment: {
                    english: "Seed treatment with fungicides, proper drainage",
                    bengali: "ছত্রাকনাশক দিয়ে বীজ শোধন, উপযুক্ত নিষ্কাশন"
                }
            },
            {
                name: {
                    english: "Black Band",
                    bengali: "কালো ব্যান্ড"
                },
                treatment: {
                    english: "Crop rotation, use of resistant varieties",
                    bengali: "ফসল পর্যায়ক্রম, প্রতিরোধী জাত ব্যবহার"
                }
            }
        ],
        pestManagement: {
            english: "Monitor for jute hairy caterpillar, apply neem-based insecticides when necessary",
            bengali: "পাট লোমশ পোকার জন্য পর্যবেক্ষণ করুন, প্রয়োজনে নিম-ভিত্তিক কীটনাশক প্রয়োগ করুন"
        },
        yieldEstimate: {
            english: "2.5-3 tons/hectare (fiber)",
            bengali: "২.৫-৩ টন/হেক্টর (আঁশ)"
        },
        marketValue: {
            english: "50-70 BDT/kg (fiber)",
            bengali: "৫০-৭০ টাকা/কেজি (আঁশ)"
        },
        tips: {
            english: "Retting is crucial for fiber quality. Harvest at the right time when plants start flowering.",
            bengali: "আঁশের গুণমান বজায় রাখতে পচন প্রক্রিয়া অত্যন্ত গুরুত্বপূর্ণ। গাছে ফুল আসা শুরু হওয়ার সময় সঠিক সময়ে ফসল কাটুন।"
        },
        image: "/images/jute.jpg"
    },
    {
        name: {
            english: "Mustard",
            bengali: "সরিষা"
        },
        category: {
            english: "Oilseed",
            bengali: "তৈলবীজ"
        },
        growingSeason: {
            english: "October-November to January-February",
            bengali: "অক্টোবর-নভেম্বর থেকে জানুয়ারি-ফেব্রুয়ারি"
        },
        waterRequirements: {
            english: "Low to moderate, sensitive to waterlogging",
            bengali: "কম থেকে মাঝারি, জলাবদ্ধতায় সংবেদনশীল"
        },
        soilType: {
            english: "Well-drained loamy to clay loam soils",
            bengali: "ভালো নিষ্কাশনযুক্ত দোআঁশ থেকে কাদা দোআঁশ মাটি"
        },
        timeToHarvest: {
            english: "85-95 days",
            bengali: "৮৫-৯৫ দিন"
        },
        fertilizers: {
            english: "Urea, TSP, MoP, Sulfur",
            bengali: "ইউরিয়া, টিএসপি, এমওপি, সালফার"
        },
        commonDiseases: [{
                name: {
                    english: "White Rust",
                    bengali: "সাদা মরিচা"
                },
                treatment: {
                    english: "Fungicide application, use resistant varieties",
                    bengali: "ছত্রাকনাশক প্রয়োগ, প্রতিরোধী জাত ব্যবহার"
                }
            },
            {
                name: {
                    english: "Alternaria Blight",
                    bengali: "অল্টারনারিয়া ব্লাইট"
                },
                treatment: {
                    english: "Seed treatment with fungicides, proper spacing",
                    bengali: "ছত্রাকনাশক দিয়ে বীজ শোধন, সঠিক দূরত্ব বজায় রাখা"
                }
            }
        ],
        pestManagement: {
            english: "Monitor for aphids and sawfly, spray neem oil or recommended insecticides if infestation is severe",
            bengali: "এফিড এবং স-ফ্লাই পর্যবেক্ষণ করুন, আক্রমণ বেশি হলে নিম তেল বা সুপারিশকৃত কীটনাশক স্প্রে করুন"
        },
        yieldEstimate: {
            english: "1-1.5 tons/hectare (seeds)",
            bengali: "১-১.৫ টন/হেক্টর (বীজ)"
        },
        marketValue: {
            english: "60-80 BDT/kg (seeds)",
            bengali: "৬০-৮০ টাকা/কেজি (বীজ)"
        },
        tips: {
            english: "Timely sowing is crucial. Irrigate during flowering and pod formation stages.",
            bengali: "সময়মত বীজ বপন অত্যন্ত গুরুত্বপূর্ণ। ফুল ও শিম গঠন পর্যায়ে সেচ দিন।"
        },
        image: "/images/mustard.jpg"
    },
    {
        name: {
            english: "Potato",
            bengali: "আলু"
        },
        category: {
            english: "Tuber Crop",
            bengali: "কন্দ ফসল"
        },
        growingSeason: {
            english: "November-December to February-March",
            bengali: "নভেম্বর-ডিসেম্বর থেকে ফেব্রুয়ারি-মার্চ"
        },
        waterRequirements: {
            english: "Moderate, sensitive to both drought and waterlogging",
            bengali: "মাঝারি, খরা এবং জলাবদ্ধতা উভয়েই সংবেদনশীল"
        },
        soilType: {
            english: "Well-drained sandy loam to loamy soils",
            bengali: "ভালো নিষ্কাশনযুক্ত বেলে দোআঁশ থেকে দোআঁশ মাটি"
        },
        timeToHarvest: {
            english: "80-90 days",
            bengali: "৮০-৯০ দিন"
        },
        fertilizers: {
            english: "Urea, TSP, MoP, compost",
            bengali: "ইউরিয়া, টিএসপি, এমওপি, কম্পোস্ট"
        },
        commonDiseases: [{
                name: {
                    english: "Late Blight",
                    bengali: "লেট ব্লাইট"
                },
                treatment: {
                    english: "Use resistant varieties, fungicide application (Mancozeb, Metalaxyl)",
                    bengali: "প্রতিরোধী জাত ব্যবহার, ছত্রাকনাশক প্রয়োগ (ম্যানকোজেব, মেটালাক্সিল)"
                }
            },
            {
                name: {
                    english: "Common Scab",
                    bengali: "কমন স্ক্যাব"
                },
                treatment: {
                    english: "Maintain soil pH below 5.5, use disease-free seed tubers",
                    bengali: "মাটির পিএইচ ৫.৫ এর নিচে রাখুন, রোগমুক্ত বীজ কন্দ ব্যবহার করুন"
                }
            }
        ],
        pestManagement: {
            english: "Monitor for cutworms and potato tuber moths, apply recommended insecticides when necessary",
            bengali: "কাটুই পোকা এবং আলুর টিউবার মথ পর্যবেক্ষণ করুন, প্রয়োজনে সুপারিশকৃত কীটনাশক প্রয়োগ করুন"
        },
        yieldEstimate: {
            english: "18-22 tons/hectare",
            bengali: "১৮-২২ টন/হেক্টর"
        },
        marketValue: {
            english: "15-25 BDT/kg",
            bengali: "১৫-২৫ টাকা/কেজি"
        },
        tips: {
            english: "Earth up soil around plants when they reach 15-20 cm height. Store harvested potatoes in cool, dark places.",
            bengali: "গাছের উচ্চতা ১৫-২০ সেমি হলে মাটি চাপা দিন। সংগৃহীত আলু ঠান্ডা, অন্ধকার স্থানে সংরক্ষণ করুন।"
        },
        image: "/images/potato.jpg"
    },
    {
        name: {
            english: "Mango",
            bengali: "আম"
        },
        category: {
            english: "Fruit",
            bengali: "ফল"
        },
        growingSeason: {
            english: "Perennial, fruiting season: April-July",
            bengali: "বহুবর্ষজীবী, ফল ধরার মৌসুম: এপ্রিল-জুলাই"
        },
        waterRequirements: {
            english: "Moderate, needs irrigation during flowering and fruit development",
            bengali: "মাঝারি, ফুল ও ফল বিকাশের সময় সেচ প্রয়োজন"
        },
        soilType: {
            english: "Well-drained deep loamy soils",
            bengali: "ভালো নিষ্কাশনযুক্ত গভীর দোআঁশ মাটি"
        },
        timeToHarvest: {
            english: "4-5 months from flowering",
            bengali: "ফুল আসা থেকে ৪-৫ মাস"
        },
        fertilizers: {
            english: "NPK mixture, organic manure, micronutrients",
            bengali: "এনপিকে মিশ্রণ, জৈব সার, সূক্ষ্ম উপাদান"
        },
        commonDiseases: [{
                name: {
                    english: "Anthracnose",
                    bengali: "অ্যানথ্রাকনোজ"
                },
                treatment: {
                    english: "Fungicide sprays, proper sanitation and pruning",
                    bengali: "ছত্রাকনাশক স্প্রে, সঠিক পরিষ্কার-পরিচ্ছন্নতা ও ছাঁটাই"
                }
            },
            {
                name: {
                    english: "Powdery Mildew",
                    bengali: "পাউডারি মিলডিউ"
                },
                treatment: {
                    english: "Sulfur-based fungicides, proper spacing between trees",
                    bengali: "সালফার-ভিত্তিক ছত্রাকনাশক, গাছের মধ্যে সঠিক দূরত্ব"
                }
            }
        ],
        pestManagement: {
            english: "Monitor for fruit flies, mealy bugs, and stem borers. Use pheromone traps and bagging of fruits.",
            bengali: "ফল মাছি, মিলিবাগ এবং কান্ড ছিদ্রকারী পোকা পর্যবেক্ষণ করুন। ফেরোমোন ফাঁদ এবং ফল ব্যাগিং ব্যবহার করুন।"
        },
        yieldEstimate: {
            english: "8-12 tons/hectare (mature orchard)",
            bengali: "৮-১২ টন/হেক্টর (পরিপক্ক বাগান)"
        },
        marketValue: {
            english: "30-120 BDT/kg (depends on variety)",
            bengali: "৩০-১২০ টাকা/কেজি (জাতের উপর নির্ভর করে)"
        },
        tips: {
            english: "Prune after harvest. Apply paclobutrazol to induce flowering. Harvest during early morning hours.",
            bengali: "ফসল সংগ্রহের পরে ছাঁটাই করুন। ফুল ধরাতে প্যাক্লোবুট্রাজল প্রয়োগ করুন। ভোরবেলা ফল সংগ্রহ করুন।"
        },
        image: "/images/mango.jpg"
    },
    {
        name: {
            english: "Wheat",
            bengali: "গম"
        },
        category: {
            english: "Cereal",
            bengali: "শস্য"
        },
        growingSeason: {
            english: "November-December to March-April",
            bengali: "নভেম্বর-ডিসেম্বর থেকে মার্চ-এপ্রিল"
        },
        waterRequirements: {
            english: "Moderate, 4-6 irrigations depending on soil type",
            bengali: "মাঝারি, মাটির ধরন অনুযায়ী ৪-৬ বার সেচ প্রয়োজন"
        },
        soilType: {
            english: "Well-drained loamy soil with good organic matter",
            bengali: "ভালো নিষ্কাশনযুক্ত দোআঁশ মাটি যাতে জৈব পদার্থ আছে"
        },
        timeToHarvest: {
            english: "110-120 days",
            bengali: "১১০-১২০ দিন"
        },
        fertilizers: {
            english: "Urea, TSP, MoP, Gypsum, Zinc",
            bengali: "ইউরিয়া, টিএসপি, এমওপি, জিপসাম, জিঙ্ক"
        },
        commonDiseases: [{
                name: {
                    english: "Leaf Rust",
                    bengali: "পাতার মরিচা"
                },
                treatment: {
                    english: "Use resistant varieties, fungicide application",
                    bengali: "প্রতিরোধী জাত ব্যবহার, ছত্রাকনাশক প্রয়োগ"
                }
            },
            {
                name: {
                    english: "Karnal Bunt",
                    bengali: "কার্নাল বান্ট"
                },
                treatment: {
                    english: "Seed treatment with fungicides, crop rotation",
                    bengali: "ছত্রাকনাশক দিয়ে বীজ শোধন, ফসল পর্যায়ক্রম"
                }
            }
        ],
        pestManagement: {
            english: "Monitor for aphids and armyworms, use light traps and recommended insecticides",
            bengali: "এফিড এবং আর্মিওয়ার্ম পর্যবেক্ষণ করুন, আলোর ফাঁদ এবং সুপারিশকৃত কীটনাশক ব্যবহার করুন"
        },
        yieldEstimate: {
            english: "3-4 tons/hectare",
            bengali: "৩-৪ টন/হেক্টর"
        },
        marketValue: {
            english: "30-35 BDT/kg",
            bengali: "৩০-৩৫ টাকা/কেজি"
        },
        tips: {
            english: "Timely sowing is crucial. Avoid late sowing as it reduces yield. Harvest when moisture content is around 20%.",
            bengali: "সময়মত বপন অত্যন্ত গুরুত্বপূর্ণ। দেরীতে বপন করলে ফলন কমে যায়। যখন আর্দ্রতা প্রায় ২০% থাকে তখন ফসল কাটুন।"
        },
        image: "/images/wheat.jpg"
    },
    {
        name: {
            english: "Maize",
            bengali: "ভুট্টা"
        },
        category: {
            english: "Cereal",
            bengali: "শস্য"
        },
        growingSeason: {
            english: "October-November to March-April (Rabi), June-July to September-October (Kharif)",
            bengali: "অক্টোবর-নভেম্বর থেকে মার্চ-এপ্রিল (রবি), জুন-জুলাই থেকে সেপ্টেম্বর-অক্টোবর (খরিফ)"
        },
        waterRequirements: {
            english: "Moderate, sensitive to waterlogging",
            bengali: "মাঝারি, জলাবদ্ধতায় সংবেদনশীল"
        },
        soilType: {
            english: "Well-drained sandy loam to loamy soils",
            bengali: "ভালো নিষ্কাশনযুক্ত বেলে দোআঁশ থেকে দোআঁশ মাটি"
        },
        timeToHarvest: {
            english: "90-100 days",
            bengali: "৯০-১০০ দিন"
        },
        fertilizers: {
            english: "Urea, TSP, MoP, Zinc sulfate",
            bengali: "ইউরিয়া, টিএসপি, এমওপি, জিঙ্ক সালফেট"
        },
        commonDiseases: [{
                name: {
                    english: "Turcicum Leaf Blight",
                    bengali: "টারসিকাম লিফ ব্লাইট"
                },
                treatment: {
                    english: "Use resistant varieties, fungicide application",
                    bengali: "প্রতিরোধী জাত ব্যবহার, ছত্রাকনাশক প্রয়োগ"
                }
            },
            {
                name: {
                    english: "Common Rust",
                    bengali: "কমন রাস্ট"
                },
                treatment: {
                    english: "Use resistant varieties, balanced fertilization",
                    bengali: "প্রতিরোধী জাত ব্যবহার, সুষম সার প্রয়োগ"
                }
            }
        ],
        pestManagement: {
            english: "Monitor for stem borers and armyworms, use pheromone traps and recommended insecticides",
            bengali: "কান্ড ছিদ্রকারী পোকা এবং আর্মিওয়ার্ম পর্যবেক্ষণ করুন, ফেরোমোন ফাঁদ এবং সুপারিশকৃত কীটনাশক ব্যবহার করুন"
        },
        yieldEstimate: {
            english: "6-8 tons/hectare",
            bengali: "৬-৮ টন/হেক্টর"
        },
        marketValue: {
            english: "25-30 BDT/kg",
            bengali: "২৫-৩০ টাকা/কেজি"
        },
        tips: {
            english: "Plant population should be maintained at 60,000-70,000 plants per hectare. Harvest when moisture content is around 20-25%.",
            bengali: "প্রতি হেক্টরে ৬০,০০০-৭০,০০০ গাছ রাখা উচিত। যখন আর্দ্রতা প্রায় ২০-২৫% থাকে তখন ফসল কাটুন।"
        },
        image: "/images/maize.jpg"
    },
    {
        name: {
            english: "Lentil",
            bengali: "মসুর"
        },
        category: {
            english: "Pulse",
            bengali: "ডাল"
        },
        growingSeason: {
            english: "October-November to February-March",
            bengali: "অক্টোবর-নভেম্বর থেকে ফেব্রুয়ারি-মার্চ"
        },
        waterRequirements: {
            english: "Low to moderate, drought tolerant",
            bengali: "কম থেকে মাঝারি, খরা সহিষ্ণু"
        },
        soilType: {
            english: "Well-drained sandy loam to loamy soils",
            bengali: "ভালো নিষ্কাশনযুক্ত বেলে দোআঁশ থেকে দোআঁশ মাটি"
        },
        timeToHarvest: {
            english: "110-120 days",
            bengali: "১১০-১২০ দিন"
        },
        fertilizers: {
            english: "Urea, TSP, MoP, Gypsum",
            bengali: "ইউরিয়া, টিএসপি, এমওপি, জিপসাম"
        },
        commonDiseases: [{
                name: {
                    english: "Stemphylium Blight",
                    bengali: "স্টেমফাইলিয়াম ব্লাইট"
                },
                treatment: {
                    english: "Seed treatment with fungicides, crop rotation",
                    bengali: "ছত্রাকনাশক দিয়ে বীজ শোধন, ফসল পর্যায়ক্রম"
                }
            },
            {
                name: {
                    english: "Fusarium Wilt",
                    bengali: "ফিউজারিয়াম উইল্ট"
                },
                treatment: {
                    english: "Use resistant varieties, soil solarization",
                    bengali: "প্রতিরোধী জাত ব্যবহার, মাটি সৌরীকরণ"
                }
            }
        ],
        pestManagement: {
            english: "Monitor for pod borers and aphids, use neem-based pesticides when necessary",
            bengali: "শিম ছিদ্রকারী পোকা এবং এফিড পর্যবেক্ষণ করুন, প্রয়োজনে নিম-ভিত্তিক কীটনাশক ব্যবহার করুন"
        },
        yieldEstimate: {
            english: "1-1.2 tons/hectare",
            bengali: "১-১.২ টন/হেক্টর"
        },
        marketValue: {
            english: "80-100 BDT/kg",
            bengali: "৮০-১০০ টাকা/কেজি"
        },
        tips: {
            english: "Sow in rows for better management. Harvest when 80% pods turn brown and dry.",
            bengali: "ভালো ব্যবস্থাপনার জন্য সারিতে বপন করুন। যখন ৮০% শিম বাদামি এবং শুকনো হয় তখন ফসল কাটুন।"
        },
        image: "/images/lentil.jpg"
    },
    {
        name: {
            english: "Chickpea",
            bengali: "ছোলা"
        },
        category: {
            english: "Pulse",
            bengali: "ডাল"
        },
        growingSeason: {
            english: "October-November to February-March",
            bengali: "অক্টোবর-নভেম্বর থেকে ফেব্রুয়ারি-মার্চ"
        },
        waterRequirements: {
            english: "Low, drought tolerant",
            bengali: "কম, খরা সহিষ্ণু"
        },
        soilType: {
            english: "Well-drained sandy loam to clay loam soils",
            bengali: "ভালো নিষ্কাশনযুক্ত বেলে দোআঁশ থেকে কাদা দোআঁশ মাটি"
        },
        timeToHarvest: {
            english: "100-110 days",
            bengali: "১০০-১১০ দিন"
        },
        fertilizers: {
            english: "Urea, TSP, MoP, Gypsum",
            bengali: "ইউরিয়া, টিএসপি, এমওপি, জিপসাম"
        },
        commonDiseases: [{
                name: {
                    english: "Fusarium Wilt",
                    bengali: "ফিউজারিয়াম উইল্ট"
                },
                treatment: {
                    english: "Use resistant varieties, crop rotation",
                    bengali: "প্রতিরোধী জাত ব্যবহার, ফসল পর্যায়ক্রম"
                }
            },
            {
                name: {
                    english: "Ascochyta Blight",
                    bengali: "অ্যাসকোচাইটা ব্লাইট"
                },
                treatment: {
                    english: "Seed treatment with fungicides, avoid dense planting",
                    bengali: "ছত্রাকনাশক দিয়ে বীজ শোধন, ঘন বপন এড়িয়ে চলুন"
                }
            }
        ],
        pestManagement: {
            english: "Monitor for pod borers and cutworms, use neem-based pesticides when necessary",
            bengali: "শিম ছিদ্রকারী পোকা এবং কাটুই পোকা পর্যবেক্ষণ করুন, প্রয়োজনে নিম-ভিত্তিক কীটনাশক ব্যবহার করুন"
        },
        yieldEstimate: {
            english: "1.2-1.5 tons/hectare",
            bengali: "১.২-১.৫ টন/হেক্টর"
        },
        marketValue: {
            english: "70-90 BDT/kg",
            bengali: "৭০-৯০ টাকা/কেজি"
        },
        tips: {
            english: "Avoid waterlogging. Harvest when 80% pods turn brown and dry.",
            bengali: "জলাবদ্ধতা এড়িয়ে চলুন। যখন ৮০% শিম বাদামি এবং শুকনো হয় তখন ফসল কাটুন।"
        },
        image: "/images/chickpea.jpg"
    },
    {
        name: {
            english: "Bitter Gourd",
            bengali: "করলা"
        },
        category: {
            english: "Vegetable",
            bengali: "শাকসবজি"
        },
        growingSeason: {
            english: "February-March to June-July (Summer), September-October to December-January (Winter)",
            bengali: "ফেব্রুয়ারি-মার্চ থেকে জুন-জুলাই (গ্রীষ্ম), সেপ্টেম্বর-অক্টোবর থেকে ডিসেম্বর-জানুয়ারি (শীত)"
        },
        waterRequirements: {
            english: "Moderate, requires regular irrigation",
            bengali: "মাঝারি, নিয়মিত সেচ প্রয়োজন"
        },
        soilType: {
            english: "Well-drained loamy soil rich in organic matter",
            bengali: "ভালো নিষ্কাশনযুক্ত দোআঁশ মাটি যাতে জৈব পদার্থ বেশি"
        },
        timeToHarvest: {
            english: "55-60 days from sowing",
            bengali: "বীজ বপন থেকে ৫৫-৬০ দিন"
        },
        fertilizers: {
            english: "Urea, TSP, MoP, compost",
            bengali: "ইউরিয়া, টিএসপি, এমওপি, কম্পোস্ট"
        },
        commonDiseases: [{
                name: {
                    english: "Powdery Mildew",
                    bengali: "পাউডারি মিলডিউ"
                },
                treatment: {
                    english: "Sulfur-based fungicides, proper spacing",
                    bengali: "সালফার-ভিত্তিক ছত্রাকনাশক, সঠিক দূরত্ব"
                }
            },
            {
                name: {
                    english: "Fruit Rot",
                    bengali: "ফল পচা"
                },
                treatment: {
                    english: "Proper drainage, fungicide application",
                    bengali: "উপযুক্ত নিষ্কাশন, ছত্রাকনাশক প্রয়োগ"
                }
            }
        ],
        pestManagement: {
            english: "Monitor for fruit flies and red pumpkin beetles, use neem oil or recommended pesticides",
            bengali: "ফল মাছি এবং লাল কুমড়া বিটল পর্যবেক্ষণ করুন, নিম তেল বা সুপারিশকৃত কীটনাশক ব্যবহার করুন"
        },
        yieldEstimate: {
            english: "8-10 tons/hectare",
            bengali: "৮-১০ টন/হেক্টর"
        },
        marketValue: {
            english: "40-60 BDT/kg",
            bengali: "৪০-৬০ টাকা/কেজি"
        },
        tips: {
            english: "Provide trellis for better growth and yield. Harvest when fruits are tender and green.",
            bengali: "ভালো বৃদ্ধি এবং ফলনের জন্য মাচা প্রদান করুন। ফল যখন কচি এবং সবুজ থাকে তখন সংগ্রহ করুন।"
        },
        image: "/images/bitter_gourd.jpg"
    },
    {
        name: {
            english: "Eggplant",
            bengali: "বেগুন"
        },
        category: {
            english: "Vegetable",
            bengali: "শাকসবজি"
        },
        growingSeason: {
            english: "August-September to December-January (Winter), February-March to June-July (Summer)",
            bengali: "আগস্ট-সেপ্টেম্বর থেকে ডিসেম্বর-জানুয়ারি (শীত), ফেব্রুয়ারি-মার্চ থেকে জুন-জুলাই (গ্রীষ্ম)"
        },
        waterRequirements: {
            english: "Moderate, requires regular irrigation",
            bengali: "মাঝারি, নিয়মিত সেচ প্রয়োজন"
        },
        soilType: {
            english: "Well-drained loamy soil rich in organic matter",
            bengali: "ভালো নিষ্কাশনযুক্ত দোআঁশ মাটি যাতে জৈব পদার্থ বেশি"
        },
        timeToHarvest: {
            english: "70-80 days from transplanting",
            bengali: "চারা রোপণ থেকে ৭০-৮০ দিন"
        },
        fertilizers: {
            english: "Urea, TSP, MoP, compost",
            bengali: "ইউরিয়া, টিএসপি, এমওপি, কম্পোস্ট"
        },
        commonDiseases: [{
                name: {
                    english: "Phomopsis Blight",
                    bengali: "ফোমোপসিস ব্লাইট"
                },
                treatment: {
                    english: "Seed treatment, fungicide application",
                    bengali: "বীজ শোধন, ছত্রাকনাশক প্রয়োগ"
                }
            },
            {
                name: {
                    english: "Bacterial Wilt",
                    bengali: "ব্যাকটেরিয়াল উইল্ট"
                },
                treatment: {
                    english: "Use resistant varieties, crop rotation",
                    bengali: "প্রতিরোধী জাত ব্যবহার, ফসল পর্যায়ক্রম"
                }
            }
        ],
        pestManagement: {
            english: "Monitor for fruit and shoot borers, use pheromone traps and recommended pesticides",
            bengali: "ফল ও কান্ড ছিদ্রকারী পোকা পর্যবেক্ষণ করুন, ফেরোমোন ফাঁদ এবং সুপারিশকৃত কীটনাশক ব্যবহার করুন"
        },
        yieldEstimate: {
            english: "20-25 tons/hectare",
            bengali: "২০-২৫ টন/হেক্টর"
        },
        marketValue: {
            english: "30-50 BDT/kg",
            bengali: "৩০-৫০ টাকা/কেজি"
        },
        tips: {
            english: "Staking improves fruit quality. Harvest regularly to encourage continuous fruiting.",
            bengali: "খুঁটি দিলে ফলনের গুণমান ভালো হয়। অবিচ্ছিন্ন ফলনের জন্য নিয়মিত সংগ্রহ করুন।"
        },
        image: "/images/eggplant.jpg"
    },
    {
        name: {
            english: "Tomato",
            bengali: "টমেটো"
        },
        category: {
            english: "Vegetable",
            bengali: "শাকসবজি"
        },
        growingSeason: {
            english: "October-November to February-March (Winter), June-July to September-October (Summer)",
            bengali: "অক্টোবর-নভেম্বর থেকে ফেব্রুয়ারি-মার্চ (শীতকালীন), জুন-জুলাই থেকে সেপ্টেম্বর-অক্টোবর (গ্রীষ্মকালীন)"
        },
        waterRequirements: {
            english: "Moderate, requires consistent moisture without waterlogging",
            bengali: "মাঝারি, জলাবদ্ধতা ছাড়াই নিরবিচারে আর্দ্রতা প্রয়োজন"
        },
        soilType: {
            english: "Well-drained sandy loam to loamy soils rich in organic matter",
            bengali: "ভালো নিষ্কাশনযুক্ত বেলে দোআঁশ থেকে দোআঁশ মাটি যাতে জৈব পদার্থ বেশি থাকে"
        },
        timeToHarvest: {
            english: "60-80 days after transplanting",
            bengali: "চারা রোপণের ৬০-৮০ দিন পরে"
        },
        fertilizers: {
            english: "Urea, TSP, MoP, compost",
            bengali: "ইউরিয়া, টিএসপি, এমওপি, কম্পোস্ট"
        },
        commonDiseases: [{
                name: {
                    english: "Early Blight",
                    bengali: "আর্লি ব্লাইট"
                },
                treatment: {
                    english: "Use fungicide sprays and crop rotation",
                    bengali: "ছত্রাকনাশক স্প্রে এবং ফসল পর্যায়ক্রম ব্যবহার করুন"
                }
            },
            {
                name: {
                    english: "Late Blight",
                    bengali: "লেট ব্লাইট"
                },
                treatment: {
                    english: "Use resistant varieties and appropriate fungicides",
                    bengali: "প্রতিরোধী জাত এবং উপযুক্ত ছত্রাকনাশক ব্যবহার করুন"
                }
            }
        ],
        pestManagement: {
            english: "Monitor for fruit borers, whiteflies, and aphids; use neem oil and recommended insecticides",
            bengali: "ফল ছিদ্রকারী পোকা, হোয়াইটফ্লাই ও এফিড পর্যবেক্ষণ করুন; নিম তেল এবং সুপারিশকৃত কীটনাশক ব্যবহার করুন"
        },
        yieldEstimate: {
            english: "25-30 tons/hectare",
            bengali: "২৫-৩০ টন/হেক্টর"
        },
        marketValue: {
            english: "30-70 BDT/kg (depends on season)",
            bengali: "৩০-৭০ টাকা/কেজি (ঋতুর উপর নির্ভরশীল)"
        },
        tips: {
            english: "Support plants with stakes. Mulching helps maintain moisture and prevent diseases.",
            bengali: "গাছের জন্য খুঁটি ব্যবহার করুন। মালচিং আর্দ্রতা বজায় রাখে এবং রোগ প্রতিরোধ করে।"
        },
        image: "/images/tomato.jpg"
    },

    {
        name: {
            english: "Chili",
            bengali: "মরিচ"
        },
        category: {
            english: "Vegetable/Spice",
            bengali: "শাকসবজি/মসলা"
        },
        growingSeason: {
            english: "September-October to February-March (Winter), March-April to June-July (Summer)",
            bengali: "সেপ্টেম্বর-অক্টোবর থেকে ফেব্রুয়ারি-মার্চ (শীতকালীন), মার্চ-এপ্রিল থেকে জুন-জুলাই (গ্রীষ্মকালীন)"
        },
        waterRequirements: {
            english: "Moderate, sensitive to waterlogging",
            bengali: "মাঝারি, জলাবদ্ধতার জন্য সংবেদনশীল"
        },
        soilType: {
            english: "Well-drained sandy loam soils",
            bengali: "ভালো নিষ্কাশনযুক্ত বেলে দোআঁশ মাটি"
        },
        timeToHarvest: {
            english: "75-90 days after transplanting",
            bengali: "চারা রোপণের ৭৫-৯০ দিন পরে"
        },
        fertilizers: {
            english: "Urea, TSP, MoP, compost",
            bengali: "ইউরিয়া, টিএসপি, এমওপি, কম্পোস্ট"
        },
        commonDiseases: [{
                name: {
                    english: "Anthracnose",
                    bengali: "অ্যানথ্রাকনোজ"
                },
                treatment: {
                    english: "Use fungicides and ensure good field sanitation",
                    bengali: "ছত্রাকনাশক ব্যবহার করুন এবং মাঠ পরিষ্কার রাখুন"
                }
            },
            {
                name: {
                    english: "Leaf Spot",
                    bengali: "পাতার দাগ রোগ"
                },
                treatment: {
                    english: "Spray appropriate fungicides at early stages",
                    bengali: "প্রাথমিক অবস্থায় উপযুক্ত ছত্রাকনাশক স্প্রে করুন"
                }
            }
        ],
        pestManagement: {
            english: "Monitor for thrips, mites, and fruit borers; use neem oil and recommended insecticides",
            bengali: "থ্রিপস, মাইটস এবং ফল ছিদ্রকারী পোকার জন্য নজর রাখুন; নিম তেল এবং সুপারিশকৃত কীটনাশক ব্যবহার করুন"
        },
        yieldEstimate: {
            english: "5-8 tons/hectare (green chili)",
            bengali: "৫-৮ টন/হেক্টর (কাঁচা মরিচ)"
        },
        marketValue: {
            english: "60-150 BDT/kg (season dependent)",
            bengali: "৬০-১৫০ টাকা/কেজি (ঋতুর উপর নির্ভরশীল)"
        },
        tips: {
            english: "Avoid overhead irrigation to reduce disease spread. Timely harvesting ensures better fruit quality.",
            bengali: "রোগের বিস্তার রোধে সরাসরি সেচ এড়িয়ে চলুন। সময়মতো সংগ্রহে ফলের মান ভালো হয়।"
        },
        image: "/images/chili.jpg"
    },

    {
        name: {
            english: "Onion",
            bengali: "পেঁয়াজ"
        },
        category: {
            english: "Vegetable/Spice",
            bengali: "শাকসবজি/মসলা"
        },
        growingSeason: {
            english: "November-December to March-April",
            bengali: "নভেম্বর-ডিসেম্বর থেকে মার্চ-এপ্রিল"
        },
        waterRequirements: {
            english: "Moderate, avoid waterlogging",
            bengali: "মাঝারি, জলাবদ্ধতা এড়িয়ে চলুন"
        },
        soilType: {
            english: "Well-drained loamy soils rich in organic matter",
            bengali: "ভালো নিষ্কাশনযুক্ত দোআঁশ মাটি যাতে জৈব পদার্থ বেশি"
        },
        timeToHarvest: {
            english: "90-120 days from sowing",
            bengali: "বীজ বপনের ৯০-১২০ দিন পরে"
        },
        fertilizers: {
            english: "Urea, TSP, MoP, compost",
            bengali: "ইউরিয়া, টিএসপি, এমওপি, কম্পোস্ট"
        },
        commonDiseases: [{
                name: {
                    english: "Purple Blotch",
                    bengali: "বেগুনি দাগ রোগ"
                },
                treatment: {
                    english: "Use fungicides and ensure proper aeration",
                    bengali: "ছত্রাকনাশক ব্যবহার করুন এবং সঠিক বায়ুচলাচল নিশ্চিত করুন"
                }
            },
            {
                name: {
                    english: "Downy Mildew",
                    bengali: "ডাউনি মিলডিউ"
                },
                treatment: {
                    english: "Ensure field drainage and fungicide application",
                    bengali: "মাঠের নিষ্কাশন নিশ্চিত করুন এবং ছত্রাকনাশক প্রয়োগ করুন"
                }
            }
        ],
        pestManagement: {
            english: "Monitor for thrips and onion flies; use recommended insecticides",
            bengali: "থ্রিপস ও পেঁয়াজ মাছির জন্য পর্যবেক্ষণ করুন; সুপারিশকৃত কীটনাশক ব্যবহার করুন"
        },
        yieldEstimate: {
            english: "10-15 tons/hectare",
            bengali: "১০-১৫ টন/হেক্টর"
        },
        marketValue: {
            english: "30-80 BDT/kg",
            bengali: "৩০-৮০ টাকা/কেজি"
        },
        tips: {
            english: "Irrigate during bulb development but stop watering before harvesting to enhance storage life.",
            bengali: "বল্ব (গুটি) গঠনের সময় সেচ দিন, তবে কাটার আগে পানি বন্ধ করুন যাতে সংরক্ষণ ক্ষমতা বাড়ে।"
        },
        image: "/images/onion.jpg"
    },

    {
        name: {
            english: "Garlic",
            bengali: "রসুন"
        },
        category: {
            english: "Vegetable/Spice",
            bengali: "শাকসবজি/মসলা"
        },
        growingSeason: {
            english: "November-December to March-April",
            bengali: "নভেম্বর-ডিসেম্বর থেকে মার্চ-এপ্রিল"
        },
        waterRequirements: {
            english: "Low to moderate, avoid excessive moisture",
            bengali: "কম থেকে মাঝারি, অতিরিক্ত আর্দ্রতা এড়িয়ে চলুন"
        },
        soilType: {
            english: "Sandy loam soils rich in organic matter",
            bengali: "জৈব পদার্থ সমৃদ্ধ বেলে দোআঁশ মাটি"
        },
        timeToHarvest: {
            english: "110-130 days from planting",
            bengali: "রোপণের ১১০-১৩০ দিন পরে"
        },
        fertilizers: {
            english: "Urea, TSP, MoP, compost",
            bengali: "ইউরিয়া, টিএসপি, এমওপি, কম্পোস্ট"
        },
        commonDiseases: [{
                name: {
                    english: "White Rot",
                    bengali: "সাদা পচা রোগ"
                },
                treatment: {
                    english: "Crop rotation and fungicide treatment",
                    bengali: "ফসল পর্যায়ক্রম এবং ছত্রাকনাশক ব্যবহার করুন"
                }
            },
            {
                name: {
                    english: "Downy Mildew",
                    bengali: "ডাউনি মিলডিউ"
                },
                treatment: {
                    english: "Proper spacing and fungicide application",
                    bengali: "সঠিক দূরত্ব বজায় রাখা এবং ছত্রাকনাশক প্রয়োগ করা"
                }
            }
        ],
        pestManagement: {
            english: "Monitor for onion thrips and nematodes; use appropriate insecticides",
            bengali: "পেঁয়াজ থ্রিপস ও নিমাটোড পর্যবেক্ষণ করুন; উপযুক্ত কীটনাশক ব্যবহার করুন"
        },
        yieldEstimate: {
            english: "7-10 tons/hectare",
            bengali: "৭-১০ টন/হেক্টর"
        },
        marketValue: {
            english: "80-120 BDT/kg",
            bengali: "৮০-১২০ টাকা/কেজি"
        },
        tips: {
            english: "Stop irrigation 10-15 days before harvest for better bulb quality.",
            bengali: "ভালো গুটি মানের জন্য ফসল কাটার ১০-১৫ দিন আগে সেচ বন্ধ করুন।"
        },
        image: "/images/garlic.jpg"
    },

    {
        name: {
            english: "Banana",
            bengali: "কলা"
        },
        category: {
            english: "Fruit",
            bengali: "ফল"
        },
        growingSeason: {
            english: "Year-round; best planting time: March-May and September-November",
            bengali: "সারা বছর; সর্বোত্তম রোপণের সময়: মার্চ-মে এবং সেপ্টেম্বর-নভেম্বর"
        },
        waterRequirements: {
            english: "High, requires frequent irrigation",
            bengali: "উচ্চ, ঘন ঘন সেচ প্রয়োজন"
        },
        soilType: {
            english: "Well-drained loamy soil rich in organic matter",
            bengali: "ভালো নিষ্কাশনযুক্ত জৈব পদার্থযুক্ত দোআঁশ মাটি"
        },
        timeToHarvest: {
            english: "10-12 months from planting",
            bengali: "রোপণের ১০-১২ মাস পরে"
        },
        fertilizers: {
            english: "NPK mixture, organic manure",
            bengali: "এনপিকে মিশ্রণ, জৈব সার"
        },
        commonDiseases: [{
                name: {
                    english: "Panama Wilt",
                    bengali: "পানামা উইল্ট"
                },
                treatment: {
                    english: "Use resistant varieties, avoid infected fields",
                    bengali: "প্রতিরোধী জাত ব্যবহার করুন, সংক্রামিত মাঠ এড়িয়ে চলুন"
                }
            },
            {
                name: {
                    english: "Sigatoka Leaf Spot",
                    bengali: "সিগাটোকা পাতার দাগ"
                },
                treatment: {
                    english: "Fungicide spray and proper spacing",
                    bengali: "ছত্রাকনাশক স্প্রে এবং সঠিক দূরত্ব বজায় রাখা"
                }
            }
        ],
        pestManagement: {
            english: "Monitor for banana weevil and aphids; apply neem oil and insecticides as needed",
            bengali: "কলা উইভিল ও এফিডের জন্য নজর রাখুন; প্রয়োজনে নিম তেল ও কীটনাশক প্রয়োগ করুন"
        },
        yieldEstimate: {
            english: "40-50 tons/hectare",
            bengali: "৪০-৫০ টন/হেক্টর"
        },
        marketValue: {
            english: "10-15 BDT/piece (variety dependent)",
            bengali: "১০-১৫ টাকা/টি (জাত অনুসারে)"
        },
        tips: {
            english: "Support plants with bamboo stakes. Remove suckers regularly for better fruit development.",
            bengali: "গাছের জন্য বাঁশের খুঁটি ব্যবহার করুন। ভালো ফল গঠনের জন্য নিয়মিত চারা সরান।"
        },
        image: "/images/banana.jpg"
    },

    {
        name: {
            english: "Litchi",
            bengali: "লিচু"
        },
        category: {
            english: "Fruit",
            bengali: "ফল"
        },
        growingSeason: {
            english: "Perennial; flowering in February-March, harvesting in May-June",
            bengali: "বহুবর্ষজীবী; ফেব্রুয়ারি-মার্চে ফুল আসে, মে-জুনে ফসল তোলা হয়"
        },
        waterRequirements: {
            english: "Moderate, critical during flowering and fruit set",
            bengali: "মাঝারি, ফুল ও ফল গঠনের সময় সেচ অপরিহার্য"
        },
        soilType: {
            english: "Well-drained sandy loam to loamy soils",
            bengali: "ভালো নিষ্কাশনযুক্ত বেলে দোআঁশ থেকে দোআঁশ মাটি"
        },
        timeToHarvest: {
            english: "4-5 months after flowering",
            bengali: "ফুল আসার ৪-৫ মাস পরে"
        },
        fertilizers: {
            english: "NPK, organic compost, micronutrients",
            bengali: "এনপিকে, জৈব সার, ক্ষুদ্র উপাদান"
        },
        commonDiseases: [{
                name: {
                    english: "Fruit Cracking",
                    bengali: "ফল ফাটা"
                },
                treatment: {
                    english: "Avoid moisture stress, provide boron-rich foliar sprays",
                    bengali: "আর্দ্রতার চাপ এড়িয়ে চলুন, বরনযুক্ত স্প্রে ব্যবহার করুন"
                }
            },
            {
                name: {
                    english: "Sooty Mold",
                    bengali: "কালো ছাঁচ"
                },
                treatment: {
                    english: "Control insects like aphids to prevent mold",
                    bengali: "ছাঁচ প্রতিরোধে এফিডসহ পোকা নিয়ন্ত্রণ করুন"
                }
            }
        ],
        pestManagement: {
            english: "Use light traps for fruit borers and protect fruits with paper bags",
            bengali: "ফল ছিদ্রকারী পোকা ধরার জন্য আলো ফাঁদ ব্যবহার করুন এবং কাগজের ব্যাগ দিয়ে ফল ঢেকে রাখুন"
        },
        yieldEstimate: {
            english: "8-12 tons/hectare",
            bengali: "৮-১২ টন/হেক্টর"
        },
        marketValue: {
            english: "100-250 BDT/kg (variety and season dependent)",
            bengali: "১০০-২৫০ টাকা/কেজি (জাত ও ঋতুর উপর নির্ভর করে)"
        },
        tips: {
            english: "Mulching and regular irrigation help maintain flowering and fruit quality.",
            bengali: "মালচিং ও নিয়মিত সেচ ফুল ও ফলের মান বজায় রাখতে সহায়ক।"
        },
        image: "/images/litchi.jpg"
    },

    {
        name: {
            english: "Sugarcane",
            bengali: "আখ"
        },
        category: {
            english: "Cash Crop",
            bengali: "নগদ ফসল"
        },
        growingSeason: {
            english: "December-February (planting), harvested after 10-12 months",
            bengali: "ডিসেম্বর-ফেব্রুয়ারি (রোপণ), ১০-১২ মাস পরে কাটার উপযুক্ত"
        },
        waterRequirements: {
            english: "High, needs frequent irrigation",
            bengali: "উচ্চ, ঘন ঘন সেচ প্রয়োজন"
        },
        soilType: {
            english: "Deep, well-drained fertile loamy soils",
            bengali: "গভীর, উর্বর ও ভালো নিষ্কাশনযুক্ত দোআঁশ মাটি"
        },
        timeToHarvest: {
            english: "10-12 months",
            bengali: "১০-১২ মাস"
        },
        fertilizers: {
            english: "Urea, TSP, MoP, organic manure",
            bengali: "ইউরিয়া, টিএসপি, এমওপি, জৈব সার"
        },
        commonDiseases: [{
                name: {
                    english: "Red Rot",
                    bengali: "রেড রট"
                },
                treatment: {
                    english: "Use disease-free setts, crop rotation",
                    bengali: "রোগমুক্ত কাটিং ব্যবহার করুন, ফসল পর্যায়ক্রম করুন"
                }
            },
            {
                name: {
                    english: "Smut",
                    bengali: "স্মাট"
                },
                treatment: {
                    english: "Hot water treatment of setts",
                    bengali: "কাটিং গরম পানিতে শোধন করুন"
                }
            }
        ],
        pestManagement: {
            english: "Monitor for stem borers and termites, apply neem-based insecticides",
            bengali: "কান্ড ছিদ্রকারী পোকা ও উইপোকা পর্যবেক্ষণ করুন, নিম-ভিত্তিক কীটনাশক ব্যবহার করুন"
        },
        yieldEstimate: {
            english: "70-100 tons/hectare",
            bengali: "৭০-১০০ টন/হেক্টর"
        },
        marketValue: {
            english: "250-350 BDT/ton",
            bengali: "২৫০-৩৫০ টাকা/টন"
        },
        tips: {
            english: "Timely earthing up and regular weeding improves yield.",
            bengali: "সঠিক সময়ে মাটি চাপা ও আগাছা নিয়ন্ত্রণ করলে ফলন বাড়ে।"
        },
        image: "/images/sugarcane.jpg"
    },

    {
        name: {
            english: "Sesame",
            bengali: "তিল"
        },
        category: {
            english: "Oilseed",
            bengali: "তৈলবীজ"
        },
        growingSeason: {
            english: "March-April (Kharif), July-August (Rabi)",
            bengali: "মার্চ-এপ্রিল (খরিফ), জুলাই-আগস্ট (রবি)"
        },
        waterRequirements: {
            english: "Low, drought tolerant",
            bengali: "কম, খরা সহনশীল"
        },
        soilType: {
            english: "Well-drained sandy loam to loamy soils",
            bengali: "ভালো নিষ্কাশনযুক্ত বেলে দোআঁশ থেকে দোআঁশ মাটি"
        },
        timeToHarvest: {
            english: "85-100 days",
            bengali: "৮৫-১০০ দিন"
        },
        fertilizers: {
            english: "Urea, TSP, MoP, Sulfur",
            bengali: "ইউরিয়া, টিএসপি, এমওপি, সালফার"
        },
        commonDiseases: [{
                name: {
                    english: "Leaf Spot",
                    bengali: "পাতার দাগ"
                },
                treatment: {
                    english: "Fungicide spray, proper spacing",
                    bengali: "ছত্রাকনাশক স্প্রে, সঠিক দূরত্ব বজায় রাখা"
                }
            },
            {
                name: {
                    english: "Root Rot",
                    bengali: "মূল পচা"
                },
                treatment: {
                    english: "Crop rotation and drainage",
                    bengali: "ফসল পর্যায়ক্রম এবং সঠিক নিষ্কাশন"
                }
            }
        ],
        pestManagement: {
            english: "Monitor for leaf rollers and aphids, apply neem oil or recommended insecticides",
            bengali: "পাতা মোড়ানো পোকা ও এফিডের জন্য নজর রাখুন, নিম তেল বা সুপারিশকৃত কীটনাশক ব্যবহার করুন"
        },
        yieldEstimate: {
            english: "800-1000 kg/hectare",
            bengali: "৮০০-১০০০ কেজি/হেক্টর"
        },
        marketValue: {
            english: "100-150 BDT/kg",
            bengali: "১০০-১৫০ টাকা/কেজি"
        },
        tips: {
            english: "Harvest when majority of capsules turn yellow and dry. Avoid delay to reduce seed loss.",
            bengali: "যখন অধিকাংশ ফল হলুদ ও শুকনো হয় তখন ফসল সংগ্রহ করুন। দেরি করলে বীজ ঝরে যেতে পারে।"
        },
        image: "/images/sesame.jpg"
    },

    {
        name: {
            english: "Pumpkin",
            bengali: "কুমড়া"
        },
        category: {
            english: "Vegetable",
            bengali: "শাকসবজি"
        },
        growingSeason: {
            english: "September-October to February-March (Winter), March-April to June-July (Summer)",
            bengali: "সেপ্টেম্বর-অক্টোবর থেকে ফেব্রুয়ারি-মার্চ (শীত), মার্চ-এপ্রিল থেকে জুন-জুলাই (গ্রীষ্ম)"
        },
        waterRequirements: {
            english: "Moderate, requires regular but controlled irrigation",
            bengali: "মাঝারি, নিয়মিত তবে নিয়ন্ত্রিত সেচ প্রয়োজন"
        },
        soilType: {
            english: "Fertile, well-drained loamy soils rich in organic matter",
            bengali: "উর্বর, জৈব পদার্থযুক্ত ভালো নিষ্কাশনযুক্ত দোআঁশ মাটি"
        },
        timeToHarvest: {
            english: "90-120 days from sowing",
            bengali: "বপনের ৯০-১২০ দিন পরে"
        },
        fertilizers: {
            english: "Urea, TSP, MoP, compost",
            bengali: "ইউরিয়া, টিএসপি, এমওপি, কম্পোস্ট"
        },
        commonDiseases: [{
                name: {
                    english: "Powdery Mildew",
                    bengali: "পাউডারি মিলডিউ"
                },
                treatment: {
                    english: "Use sulfur-based fungicides and ensure good air circulation",
                    bengali: "সালফার-ভিত্তিক ছত্রাকনাশক ব্যবহার করুন এবং ভালো বায়ু চলাচল নিশ্চিত করুন"
                }
            },
            {
                name: {
                    english: "Downy Mildew",
                    bengali: "ডাউনি মিলডিউ"
                },
                treatment: {
                    english: "Proper field drainage and timely fungicide spray",
                    bengali: "সঠিক নিষ্কাশন এবং সময়মতো ছত্রাকনাশক স্প্রে করুন"
                }
            }
        ],
        pestManagement: {
            english: "Monitor for fruit flies and red pumpkin beetles; use pheromone traps and neem oil sprays",
            bengali: "ফল মাছি ও লাল কুমড়া বিটল পর্যবেক্ষণ করুন; ফেরোমোন ফাঁদ এবং নিম তেল স্প্রে ব্যবহার করুন"
        },
        yieldEstimate: {
            english: "20-25 tons/hectare",
            bengali: "২০-২৫ টন/হেক্টর"
        },
        marketValue: {
            english: "20-40 BDT/kg",
            bengali: "২০-৪০ টাকা/কেজি"
        },
        tips: {
            english: "Provide space for vines to spread. Harvest when pumpkins turn orange-yellow and sound hollow.",
            bengali: "লতাগুলিকে ছড়ানোর জন্য পর্যাপ্ত জায়গা দিন। কুমড়া হলুদাভ-কমলা হলে এবং ঠোকালে ফাঁপা শব্দ হলে সংগ্রহ করুন।"
        },
        image: "/images/pumpkin.jpg"
    }


];

export default crops;