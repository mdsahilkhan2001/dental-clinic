/**
 * Bundled fallback content. The site renders entirely from this when Supabase
 * is not configured, and each admin-managed table seeds from the same data
 * (`supabase/seed/seed.sql`). Nothing here contains fabricated reviews,
 * invented clinician credentials or unverifiable claims.
 */

import type {
  BeforeAfterRow,
  BlogPostRow,
  ClinicHourRow,
  DentalSpecialtyRow,
  DoctorRow,
  FaqRow,
  GalleryImageRow,
  ServiceRow,
  TestimonialRow,
} from "@/types/database";
import { SUITABILITY_DISCLAIMER } from "@/lib/site";

const NOW = "2026-01-01T00:00:00.000Z";

function service(
  partial: Pick<
    ServiceRow,
    "title" | "slug" | "category" | "short_description"
  > &
    Partial<ServiceRow>,
): ServiceRow {
  return {
    id: partial.slug,
    description: null,
    suitable_for: [],
    procedure_steps: [],
    benefits: [],
    faqs: [],
    image_url: null,
    featured: false,
    published: true,
    display_order: 0,
    meta_title: null,
    meta_description: null,
    created_at: NOW,
    updated_at: NOW,
    ...partial,
  };
}

export const defaultServices: ServiceRow[] = [
  // ---------------------------------------------------------------- Dental
  service({
    title: "Dental Consultation",
    slug: "dental-consultation",
    category: "dental",
    short_description:
      "A complete oral examination, discussion of your concerns and a written treatment plan with clear costs.",
    description:
      "Every visit begins with a thorough consultation. The clinician examines your teeth, gums and bite, reviews your medical and dental history, and — where required — advises radiographs. You leave with a written plan that sets out recommended treatment, sequence and estimated cost so you can make an informed decision.",
    suitable_for: [
      "Anyone due for a routine check-up",
      "New patients moving to the area",
      "People with tooth pain, sensitivity or bleeding gums",
      "Patients wanting a second opinion on a proposed treatment",
    ],
    procedure_steps: [
      "History and discussion of your main concern",
      "Visual and instrument examination of teeth, gums and soft tissues",
      "Radiographs only if clinically indicated",
      "Explanation of findings with a written, costed treatment plan",
    ],
    benefits: [
      "Early detection of decay and gum disease",
      "A clear, prioritised plan rather than piecemeal treatment",
      "Transparent, itemised cost estimates",
    ],
    faqs: [
      {
        question: "How often should I have a dental check-up?",
        answer:
          "Most people benefit from a review every six months, but your clinician may suggest a shorter or longer interval based on your individual risk.",
      },
      {
        question: "Will I need X-rays at my first visit?",
        answer:
          "Only if they are needed to see between teeth or below the gum line. The clinician will explain why before any radiograph is taken.",
      },
    ],
    image_url: "/images/dental/dental-checkup.jpg",
    featured: true,
    display_order: 1,
  }),
  service({
    title: "Teeth Cleaning & Scaling",
    slug: "teeth-cleaning-and-scaling",
    category: "dental",
    short_description:
      "Professional removal of plaque, tartar and surface stains, followed by polishing and home-care advice.",
    description:
      "Scaling removes hardened deposits that brushing cannot reach, particularly along the gum line and between teeth. The appointment finishes with polishing and personalised guidance on brushing and interdental cleaning to help keep your gums healthy between visits.",
    suitable_for: [
      "Patients with visible tartar or staining",
      "People with bleeding or tender gums",
      "Anyone maintaining gum health after previous treatment",
    ],
    procedure_steps: [
      "Assessment of gum health and deposit levels",
      "Ultrasonic and hand scaling above and, where needed, just below the gum line",
      "Polishing to remove surface stain",
      "Tailored home-care demonstration",
    ],
    benefits: [
      "Fresher breath and a cleaner mouth feel",
      "Reduced gum inflammation and bleeding",
      "A baseline for monitoring gum health over time",
    ],
    faqs: [
      {
        question: "Does scaling damage or loosen teeth?",
        answer:
          "No. Scaling removes deposits that irritate the gums. Any sensation of looseness usually reflects existing gum disease that the cleaning helps to control.",
      },
    ],
    image_url: "/images/dental/teeth-cleaning.webp",
    featured: true,
    display_order: 2,
  }),
  service({
    title: "Dental Fillings",
    slug: "dental-fillings",
    category: "dental",
    short_description:
      "Tooth-coloured restorations that repair decayed or chipped teeth and restore normal function.",
    description:
      "Decayed or damaged tooth structure is removed and replaced with a bonded, tooth-coloured composite material that is shaped and polished to match the natural tooth. Most fillings are completed in a single visit.",
    suitable_for: [
      "Teeth with early to moderate decay",
      "Small chips or fractures",
      "Replacement of worn or discoloured older fillings",
    ],
    procedure_steps: [
      "Local anaesthetic if required",
      "Removal of decay and preparation of the cavity",
      "Placement and curing of the composite in layers",
      "Bite check, shaping and polishing",
    ],
    benefits: [
      "Natural appearance",
      "Conservative — preserves healthy tooth structure",
      "Usually completed in one appointment",
    ],
    faqs: [],
    display_order: 3,
  }),
  service({
    title: "Root Canal Treatment",
    slug: "root-canal-treatment",
    category: "dental",
    short_description:
      "Treatment that saves a tooth with an infected or inflamed nerve, relieving pain and preserving your natural tooth.",
    description:
      "When the pulp inside a tooth becomes infected or irreversibly inflamed, root canal treatment removes it, disinfects the canal system and seals it. A crown is often recommended afterwards to protect the tooth. Treatment may be completed over one or more visits depending on the tooth.",
    suitable_for: [
      "Persistent or severe toothache",
      "Prolonged sensitivity to hot or cold",
      "A tooth with a deep cavity, crack or dental abscess",
    ],
    procedure_steps: [
      "Local anaesthetic and isolation of the tooth",
      "Access to and cleaning of the canal system",
      "Shaping, disinfection and sealing of the canals",
      "A permanent filling and, usually, a crown to protect the tooth",
    ],
    benefits: [
      "Keeps your natural tooth",
      "Relieves infection-related pain",
      "Restores normal biting and chewing once protected",
    ],
    faqs: [
      {
        question: "Is root canal treatment painful?",
        answer:
          "The procedure is carried out under local anaesthetic and is generally comparable to having a filling. Mild tenderness for a few days afterwards is normal and settles with routine pain relief.",
      },
    ],
    display_order: 4,
  }),
  service({
    title: "Tooth Extraction",
    slug: "tooth-extraction",
    category: "dental",
    short_description:
      "Careful removal of a tooth that cannot be saved, with clear aftercare and replacement options discussed.",
    description:
      "Extraction is considered only when a tooth cannot be restored or is causing problems for the rest of the mouth. The clinician explains why removal is advised, carries it out under local anaesthetic, and discusses options to replace the tooth where appropriate.",
    suitable_for: [
      "Severely decayed or fractured teeth",
      "Advanced gum disease affecting a specific tooth",
      "Retained baby teeth or orthodontic reasons",
    ],
    procedure_steps: [
      "Assessment and radiograph if needed",
      "Local anaesthetic",
      "Gentle removal of the tooth",
      "Aftercare instructions and a plan to replace the tooth if suitable",
    ],
    benefits: [
      "Removes a source of pain or infection",
      "Protects neighbouring teeth and gums",
      "Clear guidance on bridges, implants or dentures where relevant",
    ],
    faqs: [],
    display_order: 5,
  }),
  service({
    title: "Dental Crowns",
    slug: "dental-crowns",
    category: "dental",
    short_description:
      "Custom caps that rebuild and protect a weakened, cracked or root-treated tooth.",
    description:
      "A crown covers the whole visible part of a tooth, restoring its shape, strength and appearance. Crowns are commonly used after root canal treatment or when a large filling leaves the remaining tooth vulnerable to fracture.",
    suitable_for: [
      "Root-treated back teeth",
      "Cracked or heavily filled teeth",
      "Teeth that need a change in shape or shade as part of a wider plan",
    ],
    procedure_steps: [
      "Preparation of the tooth and an impression or scan",
      "Fitting of a temporary crown",
      "Laboratory fabrication of the final crown",
      "Try-in, adjustment and cementation",
    ],
    benefits: [
      "Protects a weak tooth from fracture",
      "Restores comfortable chewing",
      "Natural-looking materials available",
    ],
    faqs: [],
    display_order: 6,
  }),
  service({
    title: "Bridges",
    slug: "bridges",
    category: "dental",
    short_description:
      "A fixed way to replace one or more missing teeth by anchoring to the teeth on either side of the gap.",
    description:
      "A bridge uses the adjacent teeth as supports for a replacement tooth (or teeth) that is fixed in place. It restores appearance and function without a removable denture. Suitability depends on the health of the supporting teeth.",
    suitable_for: [
      "One or two adjacent missing teeth",
      "Patients who prefer a fixed, non-removable option",
      "Situations where adjacent teeth would also benefit from crowns",
    ],
    procedure_steps: [
      "Assessment of the supporting teeth",
      "Preparation and impression or scan",
      "Temporary bridge while the final one is made",
      "Fit and cementation of the definitive bridge",
    ],
    benefits: [
      "Fixed replacement — nothing to remove",
      "Restores an even smile and bite",
      "Completed without surgery",
    ],
    faqs: [],
    display_order: 7,
  }),
  service({
    title: "Dental Implants",
    slug: "dental-implants",
    category: "dental",
    short_description:
      "A titanium post placed in the jaw to support a single crown, bridge or denture without affecting neighbouring teeth.",
    description:
      "An implant replaces the root of a missing tooth. Once it has integrated with the bone, a crown, bridge or denture is attached. Treatment is planned in stages and requires adequate bone and healthy gums; the clinician will assess whether it is appropriate for you.",
    suitable_for: [
      "Single or multiple missing teeth",
      "Patients wanting to avoid preparing adjacent teeth",
      "Denture wearers seeking more stability",
    ],
    procedure_steps: [
      "Detailed assessment including radiographs",
      "Surgical placement of the implant under local anaesthetic",
      "Healing and integration period",
      "Attachment of the final crown, bridge or denture",
    ],
    benefits: [
      "Does not rely on neighbouring teeth",
      "Stable support for crowns, bridges or dentures",
      "Helps maintain jawbone in the area",
    ],
    faqs: [
      {
        question: "How long does implant treatment take?",
        answer:
          "It varies by case. After placement, integration typically takes a few months before the final restoration is fitted. Your clinician will give you a timeline specific to your situation.",
      },
    ],
    image_url: "/images/dental/smile-designing.jpg",
    featured: true,
    display_order: 8,
  }),
  service({
    title: "Braces",
    slug: "braces",
    category: "dental",
    short_description:
      "Fixed orthodontic appliances that straighten crowded, spaced or misaligned teeth and correct the bite.",
    description:
      "Braces apply gentle, continuous pressure to move teeth into a healthier, more even position over time. After an orthodontic assessment, the clinician will advise whether braces, aligners or another approach best suits your goals.",
    suitable_for: [
      "Crowded or protruding teeth",
      "Gaps between teeth",
      "Bite problems affecting function or cleaning",
    ],
    procedure_steps: [
      "Orthodontic assessment, photographs and impressions or scans",
      "Fitting of the braces",
      "Regular adjustment visits",
      "Retainers to hold the result once treatment is complete",
    ],
    benefits: [
      "Teeth that are easier to clean",
      "Improved bite and function",
      "A more even smile",
    ],
    faqs: [],
    display_order: 9,
  }),
  service({
    title: "Clear Aligners",
    slug: "clear-aligners",
    category: "dental",
    short_description:
      "A series of removable, near-invisible trays that gradually align the teeth — a discreet alternative to braces for suitable cases.",
    description:
      "Clear aligners are custom-made trays worn for most of the day and changed on a set schedule. They can address a range of mild to moderate alignment concerns. Suitability is confirmed at an orthodontic assessment.",
    suitable_for: [
      "Mild to moderate crowding or spacing",
      "Adults and older teenagers who prefer a discreet option",
      "Minor relapse after previous orthodontic treatment",
    ],
    procedure_steps: [
      "Assessment and digital scan",
      "Review of the planned tooth movements",
      "Sequential wear of the aligner trays",
      "Retainers to maintain the final position",
    ],
    benefits: [
      "Discreet appearance",
      "Removable for eating and cleaning",
      "Planned, predictable stages",
    ],
    faqs: [],
    image_url: "/images/dental/clear-aligners.jpg",
    display_order: 10,
  }),
  service({
    title: "Teeth Whitening",
    slug: "teeth-whitening",
    category: "dental",
    short_description:
      "Professionally supervised whitening to lighten discoloured teeth safely, with custom trays for home top-ups.",
    description:
      "After confirming your teeth and gums are healthy, the clinician provides a professional whitening system with custom-fitted trays and clear instructions. Results vary between individuals and depend on the starting shade and cause of discolouration.",
    suitable_for: [
      "Generalised yellowing or dulling with age",
      "Staining from tea, coffee or tobacco",
      "Patients preparing for a special occasion",
    ],
    procedure_steps: [
      "Check that teeth and gums are healthy",
      "Impressions or scan for custom trays",
      "Supervised whitening with review",
      "Advice on maintaining the result",
    ],
    benefits: [
      "Custom trays for comfort and even coverage",
      "Clinician supervision throughout",
      "Guidance to reduce sensitivity",
    ],
    faqs: [],
    display_order: 11,
  }),
  service({
    title: "Smile Designing",
    slug: "smile-designing",
    category: "dental",
    short_description:
      "A planned, whole-smile approach that combines treatments such as whitening, alignment, veneers or crowns to meet your goals.",
    description:
      "Smile designing starts with a conversation about what you would like to change, followed by photographs, records and a preview of possible outcomes. The clinician then proposes a combination of treatments and a sequence. This is elective cosmetic treatment and outcomes vary between individuals.",
    suitable_for: [
      "Patients unhappy with the shape, shade or alignment of their smile",
      "People planning treatment before a wedding or event",
      "Those wanting to understand their options before committing",
    ],
    procedure_steps: [
      "Discussion of goals and smile analysis",
      "Photographs, scans and a proposed plan",
      "Preview or mock-up where appropriate",
      "Staged treatment and review",
    ],
    benefits: [
      "A coordinated plan rather than isolated treatments",
      "Clear expectations set before starting",
      "Sequenced to your priorities and budget",
    ],
    faqs: [],
    image_url: "/images/dental/smile-designing.jpg",
    featured: true,
    display_order: 12,
  }),
  service({
    title: "Pediatric Dentistry",
    slug: "pediatric-dentistry",
    category: "dental",
    short_description:
      "Gentle preventive and restorative care for children in a calm, reassuring environment.",
    description:
      "Children's appointments focus on prevention, building positive experiences and treating problems early. The clinician explains everything in child-friendly language and involves parents in home-care planning.",
    suitable_for: [
      "First dental visits for young children",
      "Routine check-ups and fluoride advice",
      "Treatment of decay in baby or young permanent teeth",
    ],
    procedure_steps: [
      "Friendly introduction and examination",
      "Preventive advice on diet and brushing",
      "Fissure sealants or fillings where needed",
      "A recall interval based on the child's risk",
    ],
    benefits: [
      "Early habits that protect adult teeth",
      "A positive first experience of dentistry",
      "Parents included in prevention planning",
    ],
    faqs: [],
    image_url: "/images/dental/pediatric-dentistry.jpg",
    featured: true,
    display_order: 13,
  }),
  service({
    title: "Gum Care",
    slug: "gum-care",
    category: "dental",
    short_description:
      "Assessment and treatment of gum inflammation and periodontal disease to keep the foundations of your teeth healthy.",
    description:
      "Gum care ranges from treating early gingivitis with a thorough clean and improved home care, to managing periodontal disease with deeper cleaning and regular maintenance. The clinician measures gum health and monitors it over time.",
    suitable_for: [
      "Bleeding, swollen or receding gums",
      "Persistent bad breath",
      "Patients with a history of gum disease",
    ],
    procedure_steps: [
      "Periodontal assessment and charting",
      "Professional cleaning above and below the gum line",
      "Home-care coaching",
      "A maintenance schedule to keep gums stable",
    ],
    benefits: [
      "Helps retain teeth long term",
      "Reduces bleeding and inflammation",
      "Objective monitoring of gum health",
    ],
    faqs: [],
    display_order: 14,
  }),
  service({
    title: "Full Mouth Rehabilitation",
    slug: "full-mouth-rehabilitation",
    category: "dental",
    short_description:
      "A comprehensive plan to restore function, comfort and appearance when several teeth need treatment.",
    description:
      "Full mouth rehabilitation coordinates multiple treatments — which may include fillings, crowns, bridges, implants, gum treatment and bite management — into a single sequenced plan. It is tailored to your needs, priorities and budget after detailed records.",
    suitable_for: [
      "Extensive wear, decay or missing teeth",
      "Long-standing bite or jaw discomfort",
      "Patients wanting to address everything in a structured way",
    ],
    procedure_steps: [
      "Comprehensive examination and records",
      "Diagnostic planning and discussion of options",
      "Staged treatment in an agreed order",
      "Long-term maintenance",
    ],
    benefits: [
      "One coordinated plan",
      "Function and comfort addressed together",
      "Clear staging and cost visibility",
    ],
    faqs: [],
    display_order: 15,
  }),
  service({
    title: "Cosmetic Dentistry",
    slug: "cosmetic-dentistry",
    category: "dental",
    short_description:
      "Elective treatments — such as bonding, veneers, whitening and reshaping — to refine the appearance of your smile.",
    description:
      "Cosmetic treatments are planned around what you want to change, with the clinician explaining what is realistic for your teeth. Healthy teeth and gums are confirmed first. As elective treatment, results vary and are discussed individually.",
    suitable_for: [
      "Chipped, worn or slightly uneven teeth",
      "Discolouration that does not respond to whitening alone",
      "Small gaps or minor shape concerns",
    ],
    procedure_steps: [
      "Smile assessment and discussion of goals",
      "Records and a proposed approach",
      "Treatment such as bonding, veneers or reshaping",
      "Review and maintenance advice",
    ],
    benefits: [
      "Focused on your specific concern",
      "Options from minimal to comprehensive",
      "Realistic expectations set in advance",
    ],
    faqs: [],
    display_order: 16,
  }),

  // ------------------------------------------------------------------ Skin
  service({
    title: "Skin Consultation",
    slug: "skin-consultation",
    category: "skin",
    short_description:
      "A one-to-one assessment of your skin concern with an explanation of likely causes and suitable next steps.",
    description:
      "The clinician reviews your skin history, current routine and concern, examines the affected areas and explains the likely contributing factors. You receive guidance on skincare and, where appropriate, a proposed treatment plan. No diagnosis or treatment is offered online — an in-person evaluation is required.",
    suitable_for: [
      "Persistent or recurring skin concerns",
      "Uncertainty about which treatment is appropriate",
      "Anyone wanting a structured skincare plan",
    ],
    procedure_steps: [
      "Discussion of your concern and history",
      "Examination of the affected areas",
      "Explanation of likely causes",
      "A written plan for skincare and any recommended treatment",
    ],
    benefits: [
      "Clarity on what is driving your concern",
      "A realistic, prioritised plan",
      "Advice tailored to your skin",
    ],
    faqs: [],
    featured: true,
    display_order: 1,
  }),
  service({
    title: "Acne Care",
    slug: "acne-care",
    category: "skin",
    short_description:
      "Consultation-led management of active acne and acne-prone skin, planned around severity and skin type.",
    description:
      "Acne care begins with an assessment of the type and severity of your acne. The clinician discusses contributing factors and outlines a management plan, which is reviewed over time and adjusted to your response. Suitability of any specific treatment is decided in person.",
    suitable_for: [
      "Active breakouts on the face, back or chest",
      "Acne that has not settled with over-the-counter products",
      "Concerns about marks left after breakouts",
    ],
    procedure_steps: [
      "Assessment of acne type and severity",
      "Review of skincare, lifestyle and triggers",
      "A staged management plan",
      "Scheduled reviews to track progress",
    ],
    benefits: [
      "A plan matched to your acne, not a generic routine",
      "Ongoing review rather than one-off advice",
      "Guidance on preventing marks and scarring",
    ],
    faqs: [],
    display_order: 2,
  }),
  service({
    title: "Pigmentation Care",
    slug: "pigmentation-care",
    category: "skin",
    short_description:
      "Assessment and management of uneven skin tone, dark patches and post-inflammatory marks.",
    description:
      "Pigmentation has several causes, including sun exposure, hormonal factors and inflammation. The clinician assesses the pattern and likely cause, and proposes a plan that typically combines sun protection, skincare and, where appropriate, in-clinic treatment.",
    suitable_for: [
      "Dark patches or blotchy tone",
      "Marks left after acne or injury",
      "Sun-related pigmentation",
    ],
    procedure_steps: [
      "Assessment of the pigmentation pattern",
      "Identification of likely causes and triggers",
      "A combined plan including sun protection",
      "Review and adjustment over time",
    ],
    benefits: [
      "Cause-focused rather than cover-up only",
      "Emphasis on protecting results",
      "Realistic timelines discussed upfront",
    ],
    faqs: [],
    display_order: 3,
  }),
  service({
    title: "Skin Rejuvenation",
    slug: "skin-rejuvenation",
    category: "skin",
    short_description:
      "Personalized plans to improve skin texture, dullness and early signs of ageing.",
    description:
      "Skin rejuvenation focuses on overall skin quality — texture, brightness and firmness. After assessing your skin, the clinician recommends a combination of skincare and suitable in-clinic treatments, with realistic expectations set in advance.",
    suitable_for: [
      "Dull or uneven texture",
      "Early fine lines",
      "Patients wanting a maintenance plan for skin health",
    ],
    procedure_steps: [
      "Skin quality assessment",
      "Discussion of goals and constraints",
      "A tailored plan combining skincare and treatment",
      "Periodic review",
    ],
    benefits: [
      "Whole-skin approach rather than a single fix",
      "Plan built around your skin and schedule",
      "Focus on maintainable results",
    ],
    faqs: [],
    display_order: 4,
  }),
  service({
    title: "Scar Care",
    slug: "scar-care",
    category: "skin",
    short_description:
      "Evaluation and management of acne scars and other scars to improve texture and appearance.",
    description:
      "Scars differ in type and depth, and respond differently to treatment. The clinician assesses your scars, explains what is realistically achievable, and proposes a plan that may combine several approaches over a number of sessions.",
    suitable_for: [
      "Acne scarring",
      "Scars from injury or surgery that have matured",
      "Uneven texture from previous skin conditions",
    ],
    procedure_steps: [
      "Assessment of scar type and maturity",
      "Explanation of realistic outcomes",
      "A staged treatment plan",
      "Review between sessions",
    ],
    benefits: [
      "Honest guidance on what treatment can achieve",
      "Combination approach where appropriate",
      "Progress reviewed at each stage",
    ],
    faqs: [],
    display_order: 5,
  }),
  service({
    title: "Cosmetic Skin Treatments",
    slug: "cosmetic-skin-treatments",
    category: "skin",
    short_description:
      "A range of elective in-clinic skin treatments, recommended only after an in-person assessment.",
    description:
      "This category covers elective skin treatments offered at the clinic. Which treatment is appropriate — if any — depends on your skin, concern and medical history, and is decided during consultation. The clinician will explain the procedure, aftercare and expected course of results before you proceed.",
    suitable_for: [
      "Patients who have had a skin consultation",
      "Specific concerns discussed with the clinician",
      "Those seeking a maintenance treatment plan",
    ],
    procedure_steps: [
      "In-person assessment and suitability check",
      "Explanation of the specific treatment and aftercare",
      "Treatment session(s) as planned",
      "Follow-up and review",
    ],
    benefits: [
      "Recommended only when appropriate",
      "Full explanation before proceeding",
      "Structured follow-up",
    ],
    faqs: [],
    display_order: 6,
  }),

  // ------------------------------------------------------------------ Hair
  service({
    title: "Hair Consultation",
    slug: "hair-consultation",
    category: "hair",
    short_description:
      "A structured assessment of hair fall or scalp concerns, with an explanation of likely causes and next steps.",
    description:
      "The clinician takes a history, examines your scalp and hair, and discusses possible contributing factors such as nutrition, general health, stress and hereditary patterns. You receive guidance and, where appropriate, a plan for further evaluation or treatment. Assessment is in person only.",
    suitable_for: [
      "Noticeable increase in hair fall",
      "Thinning or changes in hair density",
      "Scalp itching, flaking or irritation",
    ],
    procedure_steps: [
      "History and discussion of your concern",
      "Examination of the scalp and hair",
      "Explanation of likely contributing factors",
      "A plan for any further evaluation or treatment",
    ],
    benefits: [
      "A clearer understanding of the cause",
      "Advice specific to your pattern",
      "A realistic plan and timeline",
    ],
    faqs: [],
    featured: true,
    display_order: 1,
  }),
  service({
    title: "Hair Fall Care",
    slug: "hair-fall-care",
    category: "hair",
    short_description:
      "Consultation-led management of excessive hair fall, addressing contributing factors alongside any treatment.",
    description:
      "Hair fall often has more than one cause. After assessment, the clinician outlines a management plan that addresses general health and scalp care as well as any specific treatment considered appropriate for your situation, with reviews to track change.",
    suitable_for: [
      "Ongoing or seasonal increases in shedding",
      "Hair fall after illness, stress or dietary change",
      "Early thinning where the pattern is unclear",
    ],
    procedure_steps: [
      "Assessment of the pattern and likely causes",
      "Advice on nutrition, scalp care and general health",
      "Any recommended treatment explained in full",
      "Scheduled reviews",
    ],
    benefits: [
      "Addresses causes, not just symptoms",
      "Realistic expectations set early",
      "Progress reviewed objectively",
    ],
    faqs: [],
    display_order: 2,
  }),
  service({
    title: "Scalp Care",
    slug: "scalp-care",
    category: "hair",
    short_description:
      "Assessment and management of scalp conditions such as flaking, itching and irritation.",
    description:
      "A healthy scalp supports healthy hair. The clinician examines the scalp, identifies the likely condition and recommends a care plan. Persistent or severe conditions may need ongoing management.",
    suitable_for: [
      "Persistent dandruff or flaking",
      "Itchy or irritated scalp",
      "Redness or discomfort affecting daily life",
    ],
    procedure_steps: [
      "Scalp examination",
      "Identification of the likely condition",
      "A care and treatment plan",
      "Review to confirm improvement",
    ],
    benefits: [
      "Targeted rather than generic advice",
      "Comfort and symptom relief",
      "Support for overall hair health",
    ],
    faqs: [],
    display_order: 3,
  }),
  service({
    title: "Hair Restoration Treatments",
    slug: "hair-restoration-treatments",
    category: "hair",
    short_description:
      "Elective in-clinic treatments for suitable patients, recommended only after a full hair assessment.",
    description:
      "Where appropriate, the clinic offers in-clinic treatments intended to support hair density and scalp health. Suitability depends on the cause and stage of hair loss and your medical history, and is decided during consultation. The clinician explains the treatment course, what results are realistic and the aftercare involved.",
    suitable_for: [
      "Patients who have completed a hair consultation",
      "Specific patterns of hair loss discussed with the clinician",
      "Those wanting a structured, reviewed treatment plan",
    ],
    procedure_steps: [
      "Full assessment and suitability check",
      "Explanation of the treatment and expected course",
      "Treatment sessions as planned",
      "Review of response and maintenance planning",
    ],
    benefits: [
      "Recommended only when suitable",
      "Clear, realistic expectations",
      "Structured follow-up",
    ],
    faqs: [],
    display_order: 4,
  }),
  service({
    title: "Hair & Scalp Health",
    slug: "hair-and-scalp-health",
    category: "hair",
    short_description:
      "Ongoing guidance and periodic review to maintain hair and scalp condition over time.",
    description:
      "For patients who want to keep their hair and scalp in good condition, the clinic offers periodic review and maintenance advice built around your routine, general health and any previous treatment.",
    suitable_for: [
      "Maintenance after a course of treatment",
      "Patients with a history of scalp conditions",
      "Anyone wanting a proactive plan",
    ],
    procedure_steps: [
      "Baseline assessment",
      "A maintenance and monitoring plan",
      "Periodic review visits",
      "Adjustment as needed",
    ],
    benefits: [
      "Keeps gains from earlier treatment",
      "Early detection of new issues",
      "Advice that fits your routine",
    ],
    faqs: [],
    display_order: 5,
  }),

  // ------------------------------------------------------------- Aesthetic
  service({
    title: "Aesthetic Consultation",
    slug: "aesthetic-consultation",
    category: "aesthetic",
    short_description:
      "A private discussion of your aesthetic goals with an honest assessment of suitable, realistic options.",
    description:
      "The clinician listens to what you would like to change, examines the relevant areas and explains which options — if any — are appropriate for you. The focus is on realistic outcomes, safety and a plan you are comfortable with. Nothing is recommended or carried out without an in-person assessment.",
    suitable_for: [
      "Anyone considering a facial aesthetic treatment",
      "Patients unsure which option suits their goals",
      "Those wanting an unbiased opinion before deciding",
    ],
    procedure_steps: [
      "Discussion of your goals and concerns",
      "Assessment of the relevant areas",
      "Explanation of suitable options and realistic outcomes",
      "A written plan, with no pressure to proceed",
    ],
    benefits: [
      "Honest guidance on what is achievable",
      "Safety and suitability assessed first",
      "A plan at your pace",
    ],
    faqs: [],
    featured: true,
    display_order: 1,
  }),
  service({
    title: "Facial Aesthetic Treatments",
    slug: "facial-aesthetic-treatments",
    category: "aesthetic",
    short_description:
      "Elective facial treatments planned individually after assessment, with full information before you decide.",
    description:
      "This category covers elective facial aesthetic treatments offered at the clinic. Which treatment is appropriate depends on your anatomy, goals and medical history and is determined during consultation. The clinician explains the procedure, expected results, longevity and aftercare, and answers your questions before any treatment is planned.",
    suitable_for: [
      "Patients who have had an aesthetic consultation",
      "Specific concerns discussed with the clinician",
      "Those seeking a considered, staged approach",
    ],
    procedure_steps: [
      "In-person assessment and suitability check",
      "Full explanation of the treatment and aftercare",
      "Treatment as planned",
      "Review appointment",
    ],
    benefits: [
      "Individualised planning",
      "Complete information before consent",
      "Structured review",
    ],
    faqs: [],
    display_order: 2,
  }),
  service({
    title: "Cosmetic Treatments",
    slug: "cosmetic-treatments",
    category: "aesthetic",
    short_description:
      "A range of elective cosmetic procedures, each recommended only where appropriate and fully explained beforehand.",
    description:
      "The clinic offers selected elective cosmetic treatments. Suitability, expected outcomes and any risks are discussed during consultation so you can make an informed decision. Treatments are carried out only after assessment and consent.",
    suitable_for: [
      "Patients who have completed a consultation",
      "Goals that have been discussed and assessed",
      "Those comfortable proceeding after full information",
    ],
    procedure_steps: [
      "Assessment and discussion of options",
      "Explanation of outcomes, longevity and aftercare",
      "Treatment as agreed",
      "Follow-up review",
    ],
    benefits: [
      "Recommended only when appropriate",
      "Informed decision-making",
      "Aftercare and review included",
    ],
    faqs: [],
    display_order: 3,
  }),
  service({
    title: "Personalized Aesthetic Care",
    slug: "personalized-aesthetic-care",
    category: "aesthetic",
    short_description:
      "A longer-term aesthetic plan combining treatments and skincare, reviewed regularly and adjusted to your goals.",
    description:
      "For patients who want a coordinated plan rather than single treatments, the clinician develops a personalised programme that sequences treatments and skincare over time, with regular reviews to keep it aligned with your goals and budget.",
    suitable_for: [
      "Patients with more than one goal",
      "Those who prefer a gradual, planned approach",
      "Anyone wanting ongoing review and adjustment",
    ],
    procedure_steps: [
      "Comprehensive assessment and goal-setting",
      "A sequenced plan across treatments and skincare",
      "Staged appointments",
      "Regular review and refinement",
    ],
    benefits: [
      "A single coordinated plan",
      "Paced to your comfort and budget",
      "Adjusted as your goals evolve",
    ],
    faqs: [],
    display_order: 4,
  }),
];

export const defaultDoctors: DoctorRow[] = [
  {
    id: "lead-clinician",
    name: "Clinical Team",
    slug: "clinical-team",
    title: "Dental & Aesthetic Clinicians",
    qualification: "Details to be provided by the clinic",
    specialization: "Dental, skin, hair and aesthetic care",
    experience: "To be confirmed",
    bio: "Our clinicians provide dental, skin, hair and aesthetic care with an emphasis on careful assessment, clear explanation and personalized treatment planning. Full profiles, qualifications and registration details will be published here once provided by the clinic. In the meantime, please contact us directly for information about the treating clinician for your appointment.",
    image_url: null,
    languages: ["Hindi", "English"],
    services: [
      "Dental Consultation",
      "Skin Consultation",
      "Hair Consultation",
      "Aesthetic Consultation",
    ],
    published: true,
    display_order: 1,
    created_at: NOW,
    updated_at: NOW,
  },
];

export const defaultDentalSpecialties: DentalSpecialtyRow[] = [
  {
    id: "smile-designing",
    title: "Smile Designing",
    subtitle: "Whole-smile planning",
    image_url: "/images/dental/smile-designing.jpg",
    href: "/services/smile-designing",
    display_order: 1,
    published: true,
    created_at: NOW,
  },
  {
    id: "dental-implants",
    title: "Dental Implants",
    subtitle: "Replace missing teeth",
    image_url: "/images/dental/dental-checkup.jpg",
    href: "/services/dental-implants",
    display_order: 2,
    published: true,
    created_at: NOW,
  },
  {
    id: "crowns-and-bridges",
    title: "Crowns & Bridges",
    subtitle: "Restore & protect",
    image_url: "/images/dental/clear-aligners.jpg",
    href: "/services/dental-crowns",
    display_order: 3,
    published: true,
    created_at: NOW,
  },
  {
    id: "pediatric-dentistry",
    title: "Pediatric Dentistry",
    subtitle: "Gentle care for children",
    image_url: "/images/dental/pediatric-dentistry.jpg",
    href: "/services/pediatric-dentistry",
    display_order: 4,
    published: true,
    created_at: NOW,
  },
];

export const defaultGallery: GalleryImageRow[] = [
  {
    id: "clinic-1",
    image_url: "/images/clinic/operatory-unit.jpg",
    storage_path: null,
    title: "Dental operatory",
    category: "clinic",
    alt_text:
      "Dental treatment unit and chair in a treatment room at Jeevan Dental & Aesthetic Clinic",
    display_order: 1,
    published: true,
    created_at: NOW,
  },
  {
    id: "clinic-2",
    image_url: "/images/clinic/operatory-wide.jpg",
    storage_path: null,
    title: "Treatment room",
    category: "clinic",
    alt_text:
      "Wide view of a treatment room with dental chair, workstation and hand-wash basin",
    display_order: 2,
    published: true,
    created_at: NOW,
  },
  {
    id: "clinic-3",
    image_url: "/images/clinic/operatory-workstation.jpg",
    storage_path: null,
    title: "Clinician workstation",
    category: "clinic",
    alt_text:
      "Clinician workstation with imaging equipment beside the dental chair",
    display_order: 3,
    published: true,
    created_at: NOW,
  },
  {
    id: "clinic-4",
    image_url: "/images/clinic/operatory-light.jpg",
    storage_path: null,
    title: "Operating light and monitor",
    category: "clinic",
    alt_text:
      "Dental operating light and chairside monitor above the treatment chair",
    display_order: 4,
    published: true,
    created_at: NOW,
  },
  {
    id: "clinic-5",
    image_url: "/images/clinic/operatory-certificates.jpg",
    storage_path: null,
    title: "Clinic wall with certificates",
    category: "clinic",
    alt_text: "Treatment room wall displaying framed training certificates",
    display_order: 5,
    published: true,
    created_at: NOW,
  },
  {
    id: "clinic-6",
    image_url: "/images/clinic/operatory-room.jpg",
    storage_path: null,
    title: "Treatment room overview",
    category: "clinic",
    alt_text:
      "Overview of the treatment room with dental chair, curtains and workstation",
    display_order: 6,
    published: true,
    created_at: NOW,
  },
  {
    id: "clinic-7",
    image_url: "/images/clinic/operatory-chair.jpg",
    storage_path: null,
    title: "Dental chair and compressor",
    category: "clinic",
    alt_text: "Dental chair with the treatment unit and air compressor alongside",
    display_order: 7,
    published: true,
    created_at: NOW,
  },
];

export const defaultTestimonials: TestimonialRow[] = [];

export const defaultBeforeAfter: BeforeAfterRow[] = [];

export const defaultBlogPosts: BlogPostRow[] = [];

export const defaultFaqs: FaqRow[] = [
  {
    id: "faq-book",
    question: "How do I book an appointment?",
    answer:
      "You can book online through the Book Appointment page, message us on WhatsApp, or call the clinic during opening hours. Online requests are confirmed by our team before your slot is finalised.",
    category: "appointments",
    featured: true,
    display_order: 1,
    published: true,
    created_at: NOW,
    updated_at: NOW,
  },
  {
    id: "faq-services",
    question: "What services does the clinic provide?",
    answer:
      "Jeevan Dental & Aesthetic Clinic provides dental care, skin care, hair care and aesthetic care. You can see the full, current list on the Services page; only treatments the clinic actually offers are listed.",
    category: "general",
    featured: true,
    display_order: 2,
    published: true,
    created_at: NOW,
    updated_at: NOW,
  },
  {
    id: "faq-location",
    question: "Where is the clinic located?",
    answer:
      "The clinic is on Main Road, near the petrol pump, in Mahuadanr, Latehar district, Jharkhand 822119. Use the Get Directions button anywhere on this site to open Google Maps.",
    category: "general",
    featured: true,
    display_order: 3,
    published: true,
    created_at: NOW,
    updated_at: NOW,
  },
  {
    id: "faq-timings",
    question: "What are the clinic timings?",
    answer:
      "The clinic is open all seven days. Current opening hours are shown on the Contact page and in the footer, and are kept up to date by the clinic.",
    category: "general",
    featured: true,
    display_order: 4,
    published: true,
    created_at: NOW,
    updated_at: NOW,
  },
  {
    id: "faq-whatsapp",
    question: "Can I contact the clinic on WhatsApp?",
    answer:
      "Yes. Use any WhatsApp button on the site, or message +91 94307 40698. WhatsApp is a convenient way to ask a question or request an appointment.",
    category: "appointments",
    featured: true,
    display_order: 5,
    published: true,
    created_at: NOW,
    updated_at: NOW,
  },
  {
    id: "faq-walkin",
    question: "Do I need an appointment before visiting?",
    answer:
      "An appointment is recommended so we can keep your waiting time short and set aside enough time for your treatment. Walk-ins are accommodated where possible, but booked patients are seen first.",
    category: "appointments",
    featured: true,
    display_order: 6,
    published: true,
    created_at: NOW,
    updated_at: NOW,
  },
  {
    id: "faq-first-visit",
    question: "What happens at a first dental visit?",
    answer:
      "Your first visit is usually a consultation: an examination of your teeth and gums, a discussion of your concerns, radiographs only if needed, and a written treatment plan with costs. " +
      SUITABILITY_DISCLAIMER,
    category: "dental",
    featured: false,
    display_order: 7,
    published: true,
    created_at: NOW,
    updated_at: NOW,
  },
  {
    id: "faq-skin-online",
    question: "Can I get a skin or hair diagnosis online?",
    answer:
      "No. Skin and hair concerns need an in-person assessment. You can book a consultation and the clinician will examine the area, explain likely causes and discuss suitable options.",
    category: "skin",
    featured: false,
    display_order: 8,
    published: true,
    created_at: NOW,
    updated_at: NOW,
  },
  {
    id: "faq-aesthetic-suitability",
    question: "How do I know if an aesthetic treatment is right for me?",
    answer:
      "Book an aesthetic consultation. The clinician will assess the relevant areas, explain which options are appropriate and set realistic expectations before anything is planned. " +
      SUITABILITY_DISCLAIMER,
    category: "aesthetic",
    featured: false,
    display_order: 9,
    published: true,
    created_at: NOW,
    updated_at: NOW,
  },
];

/** 0 = Sunday … 6 = Saturday. Clinic is open all seven days by default. */
export const defaultClinicHours: ClinicHourRow[] = [0, 1, 2, 3, 4, 5, 6].map(
  (day) => ({
    day_of_week: day,
    is_open: true,
    morning_start: "09:00",
    morning_end: "14:00",
    evening_start: "16:00",
    evening_end: "20:00",
  }),
);

export interface SiteContent {
  hero: {
    eyebrow: string;
    headline: string;
    subheadline: string;
    primaryCtaLabel: string;
    secondaryCtaLabel: string;
  };
  about: {
    heading: string;
    body: string[];
  };
  whyChooseUs: { title: string; description: string }[];
  cta: {
    heading: string;
    body: string;
  };
  footerNote: string;
  social: {
    instagram: string;
    facebook: string;
    youtube: string;
    googleBusiness: string;
  };
}

export const defaultSiteContent: SiteContent = {
  hero: {
    eyebrow: "Jeevan Dental & Aesthetic Clinic",
    headline: "Complete Care for Your Smile, Skin & Hair",
    subheadline:
      "Personalized dental, skin, hair and aesthetic care in a comfortable and hygienic clinical environment in Mahuadanr, Latehar.",
    primaryCtaLabel: "Book an Appointment",
    secondaryCtaLabel: "WhatsApp Us",
  },
  about: {
    heading: "One clinic for your dental, skin, hair and aesthetic care",
    body: [
      "Jeevan Dental & Aesthetic Clinic brings dental, skin, hair and aesthetic care together under one roof in Mahuadanr. Whether you are visiting for a routine check-up or exploring a treatment for the first time, care begins with a proper assessment and a clear conversation about your options.",
      "We focus on personalized treatment planning, strict hygiene and infection control, and taking the time to explain what we find and why we recommend it. You decide how to proceed, with written information and costs in front of you.",
      "The clinic is easy to reach on Main Road near the petrol pump, open all seven days, and reachable by phone or WhatsApp for questions and appointments.",
    ],
  },
  whyChooseUs: [
    {
      title: "Personalized treatment plans",
      description:
        "Every plan starts with an assessment and is built around your needs, priorities and budget — not a fixed package.",
    },
    {
      title: "Patient-centred care",
      description:
        "We explain findings in plain language, answer your questions and move at a pace you are comfortable with.",
    },
    {
      title: "Hygienic clinical environment",
      description:
        "Instruments are cleaned and sterilised to protocol, and treatment areas are prepared between patients.",
    },
    {
      title: "Modern treatment approach",
      description:
        "Chairside imaging and current techniques support accurate assessment and careful, conservative treatment.",
    },
    {
      title: "Dental, skin, hair & aesthetic care",
      description:
        "Related concerns can be managed in one place, with coordinated planning where treatments overlap.",
    },
    {
      title: "Convenient location & easy booking",
      description:
        "Central Mahuadanr location on Main Road, open all seven days, with booking online, by phone or on WhatsApp.",
    },
  ],
  cta: {
    heading: "Ready to book your visit?",
    body: "Request an appointment online in a minute, or message us on WhatsApp and our team will help you find a time.",
  },
  footerNote:
    "Jeevan Dental & Aesthetic Clinic provides dental, skin, hair and aesthetic care to Mahuadanr, Latehar and the surrounding area.",
  social: {
    instagram: "",
    facebook: "",
    youtube: "",
    googleBusiness: "",
  },
};
