-- =============================================================================
-- Jeevan Dental & Aesthetic Clinic — seed data
-- Safe demo content. No fabricated reviews, credentials or patient results.
-- Placeholder text is clearly marked where real clinic information is missing.
-- Run AFTER 0001_init.sql and 0002_storage.sql. Idempotent (upserts).
-- =============================================================================

-- ----------------------------------------------------------------------------
-- Clinic hours — open all seven days (morning + evening shifts)
-- ----------------------------------------------------------------------------
insert into public.clinic_hours
  (day_of_week, is_open, morning_start, morning_end, evening_start, evening_end)
values
  (0, true, '09:00', '14:00', '16:00', '20:00'),
  (1, true, '09:00', '14:00', '16:00', '20:00'),
  (2, true, '09:00', '14:00', '16:00', '20:00'),
  (3, true, '09:00', '14:00', '16:00', '20:00'),
  (4, true, '09:00', '14:00', '16:00', '20:00'),
  (5, true, '09:00', '14:00', '16:00', '20:00'),
  (6, true, '09:00', '14:00', '16:00', '20:00')
on conflict (day_of_week) do update set
  is_open = excluded.is_open,
  morning_start = excluded.morning_start,
  morning_end = excluded.morning_end,
  evening_start = excluded.evening_start,
  evening_end = excluded.evening_end;

-- ----------------------------------------------------------------------------
-- Editable site content blocks
-- ----------------------------------------------------------------------------
insert into public.site_content (key, value) values
  ('hero', jsonb_build_object(
    'eyebrow', 'Jeevan Dental & Aesthetic Clinic',
    'headline', 'Complete Care for Your Smile, Skin & Hair',
    'subheadline', 'Personalized dental, skin, hair and aesthetic care in a comfortable and hygienic clinical environment in Mahuadanr, Latehar.',
    'primaryCtaLabel', 'Book an Appointment',
    'secondaryCtaLabel', 'WhatsApp Us'
  )),
  ('about', jsonb_build_object(
    'heading', 'One clinic for your dental, skin, hair and aesthetic care',
    'body', to_jsonb(array[
      'Jeevan Dental & Aesthetic Clinic brings dental, skin, hair and aesthetic care together under one roof in Mahuadanr. Whether you are visiting for a routine check-up or exploring a treatment for the first time, care begins with a proper assessment and a clear conversation about your options.',
      'We focus on personalized treatment planning, strict hygiene and infection control, and taking the time to explain what we find and why we recommend it. You decide how to proceed, with written information and costs in front of you.',
      'The clinic is easy to reach on Main Road near the petrol pump, open all seven days, and reachable by phone or WhatsApp for questions and appointments.'
    ])
  )),
  ('why_choose_us', jsonb_build_object('items', to_jsonb(array[
    jsonb_build_object('title', 'Personalized treatment plans', 'description', 'Every plan starts with an assessment and is built around your needs, priorities and budget — not a fixed package.'),
    jsonb_build_object('title', 'Patient-centred care', 'description', 'We explain findings in plain language, answer your questions and move at a pace you are comfortable with.'),
    jsonb_build_object('title', 'Hygienic clinical environment', 'description', 'Instruments are cleaned and sterilised to protocol, and treatment areas are prepared between patients.'),
    jsonb_build_object('title', 'Modern treatment approach', 'description', 'Chairside imaging and current techniques support accurate assessment and careful, conservative treatment.'),
    jsonb_build_object('title', 'Dental, skin, hair & aesthetic care', 'description', 'Related concerns can be managed in one place, with coordinated planning where treatments overlap.'),
    jsonb_build_object('title', 'Convenient location & easy booking', 'description', 'Central Mahuadanr location on Main Road, open all seven days, with booking online, by phone or on WhatsApp.')
  ]))),
  ('cta', jsonb_build_object(
    'heading', 'Ready to book your visit?',
    'body', 'Request an appointment online in a minute, or message us on WhatsApp and our team will help you find a time.'
  )),
  ('footer', jsonb_build_object(
    'note', 'Jeevan Dental & Aesthetic Clinic provides dental, skin, hair and aesthetic care to Mahuadanr, Latehar and the surrounding area.'
  )),
  ('social', jsonb_build_object(
    'instagram', '', 'facebook', '', 'youtube', '', 'googleBusiness', ''
  ))
on conflict (key) do update set value = excluded.value;

-- ----------------------------------------------------------------------------
-- Doctors — placeholder profile (replace with real clinician details)
-- ----------------------------------------------------------------------------
insert into public.doctors
  (slug, name, title, qualification, specialization, experience, bio, languages, services, published, display_order)
values (
  'clinical-team',
  'Clinical Team',
  'Dental & Aesthetic Clinicians',
  'Details to be provided by the clinic',
  'Dental, skin, hair and aesthetic care',
  'To be confirmed',
  'Our clinicians provide dental, skin, hair and aesthetic care with an emphasis on careful assessment, clear explanation and personalized treatment planning. Full profiles, qualifications and registration details will be published here once provided by the clinic. In the meantime, please contact us directly for information about the treating clinician for your appointment.',
  array['Hindi', 'English'],
  array['Dental Consultation', 'Skin Consultation', 'Hair Consultation', 'Aesthetic Consultation'],
  true, 1
)
on conflict (slug) do nothing;

-- ----------------------------------------------------------------------------
-- Dental specialties (homepage section — manage from admin)
-- ----------------------------------------------------------------------------
insert into public.dental_specialties (title, subtitle, image_url, href, display_order, published) values
  ('Smile Designing',     'Whole-smile planning',      '/images/dental/smile-designing.jpg',    '/services/smile-designing',   1, true),
  ('Dental Implants',      'Replace missing teeth',     '/images/dental/dental-checkup.jpg',     '/services/dental-implants',    2, true),
  ('Crowns & Bridges',     'Restore & protect',         '/images/dental/clear-aligners.jpg',     '/services/dental-crowns',     3, true),
  ('Pediatric Dentistry',  'Gentle care for children',  '/images/dental/pediatric-dentistry.jpg','/services/pediatric-dentistry',4, true)
on conflict do nothing;

-- ----------------------------------------------------------------------------
-- Gallery — real clinic photos served from /public (replace via Storage in admin)
-- ----------------------------------------------------------------------------
insert into public.gallery_images (image_url, title, category, alt_text, display_order, published) values
  ('/images/clinic/operatory-unit.jpg',        'Dental operatory',            'clinic', 'Dental treatment unit and chair in a treatment room at Jeevan Dental & Aesthetic Clinic', 1, true),
  ('/images/clinic/operatory-wide.jpg',        'Treatment room',             'clinic', 'Wide view of a treatment room with dental chair, workstation and hand-wash basin', 2, true),
  ('/images/clinic/operatory-workstation.jpg', 'Clinician workstation',      'clinic', 'Clinician workstation with imaging equipment beside the dental chair', 3, true),
  ('/images/clinic/operatory-light.jpg',       'Operating light and monitor','clinic', 'Dental operating light and chairside monitor above the treatment chair', 4, true),
  ('/images/clinic/operatory-certificates.jpg','Clinic wall with certificates','clinic','Treatment room wall displaying framed training certificates', 5, true),
  ('/images/clinic/operatory-room.jpg',        'Treatment room overview',    'clinic', 'Overview of the treatment room with dental chair, curtains and workstation', 6, true),
  ('/images/clinic/operatory-chair.jpg',       'Dental chair and compressor','clinic', 'Dental chair with the treatment unit and air compressor alongside', 7, true)
on conflict do nothing;

-- ----------------------------------------------------------------------------
-- FAQs
-- ----------------------------------------------------------------------------
insert into public.faqs (question, answer, category, featured, display_order, published) values
  ('How do I book an appointment?', 'You can book online through the Book Appointment page, message us on WhatsApp, or call the clinic during opening hours. Online requests are confirmed by our team before your slot is finalised.', 'appointments', true, 1, true),
  ('What services does the clinic provide?', 'Jeevan Dental & Aesthetic Clinic provides dental care, skin care, hair care and aesthetic care. You can see the full, current list on the Services page; only treatments the clinic actually offers are listed.', 'general', true, 2, true),
  ('Where is the clinic located?', 'The clinic is on Main Road, near the petrol pump, in Mahuadanr, Latehar district, Jharkhand 822119. Use the Get Directions button anywhere on this site to open Google Maps.', 'general', true, 3, true),
  ('What are the clinic timings?', 'The clinic is open all seven days. Current opening hours are shown on the Contact page and in the footer, and are kept up to date by the clinic.', 'general', true, 4, true),
  ('Can I contact the clinic on WhatsApp?', 'Yes. Use any WhatsApp button on the site, or message +91 94307 40698. WhatsApp is a convenient way to ask a question or request an appointment.', 'appointments', true, 5, true),
  ('Do I need an appointment before visiting?', 'An appointment is recommended so we can keep your waiting time short and set aside enough time for your treatment. Walk-ins are accommodated where possible, but booked patients are seen first.', 'appointments', true, 6, true),
  ('What happens at a first dental visit?', 'Your first visit is usually a consultation: an examination of your teeth and gums, a discussion of your concerns, radiographs only if needed, and a written treatment plan with costs. Treatment suitability varies from person to person. Please consult our clinician for an appropriate evaluation and treatment plan.', 'dental', false, 7, true),
  ('Can I get a skin or hair diagnosis online?', 'No. Skin and hair concerns need an in-person assessment. You can book a consultation and the clinician will examine the area, explain likely causes and discuss suitable options.', 'skin', false, 8, true),
  ('How do I know if an aesthetic treatment is right for me?', 'Book an aesthetic consultation. The clinician will assess the relevant areas, explain which options are appropriate and set realistic expectations before anything is planned. Treatment suitability varies from person to person. Please consult our clinician for an appropriate evaluation and treatment plan.', 'aesthetic', false, 9, true)
on conflict do nothing;

-- ----------------------------------------------------------------------------
-- Services
-- ----------------------------------------------------------------------------
insert into public.services
  (title, slug, category, short_description, description, suitable_for, procedure_steps, benefits, image_url, featured, published, display_order)
values
  ('Dental Consultation', 'dental-consultation', 'dental',
   'A complete oral examination, discussion of your concerns and a written treatment plan with clear costs.',
   'Every visit begins with a thorough consultation. The clinician examines your teeth, gums and bite, reviews your medical and dental history, and — where required — advises radiographs. You leave with a written plan that sets out recommended treatment, sequence and estimated cost so you can make an informed decision.',
   array['Anyone due for a routine check-up','New patients moving to the area','People with tooth pain, sensitivity or bleeding gums','Patients wanting a second opinion on a proposed treatment'],
   array['History and discussion of your main concern','Visual and instrument examination of teeth, gums and soft tissues','Radiographs only if clinically indicated','Explanation of findings with a written, costed treatment plan'],
   array['Early detection of decay and gum disease','A clear, prioritised plan rather than piecemeal treatment','Transparent, itemised cost estimates'],
   '/images/dental/dental-checkup.jpg', true, true, 1),

  ('Teeth Cleaning & Scaling', 'teeth-cleaning-and-scaling', 'dental',
   'Professional removal of plaque, tartar and surface stains, followed by polishing and home-care advice.',
   'Scaling removes hardened deposits that brushing cannot reach, particularly along the gum line and between teeth. The appointment finishes with polishing and personalised guidance on brushing and interdental cleaning to help keep your gums healthy between visits.',
   array['Patients with visible tartar or staining','People with bleeding or tender gums','Anyone maintaining gum health after previous treatment'],
   array['Assessment of gum health and deposit levels','Ultrasonic and hand scaling above and, where needed, just below the gum line','Polishing to remove surface stain','Tailored home-care demonstration'],
   array['Fresher breath and a cleaner mouth feel','Reduced gum inflammation and bleeding','A baseline for monitoring gum health over time'],
   '/images/dental/teeth-cleaning.webp', true, true, 2),

  ('Dental Fillings', 'dental-fillings', 'dental',
   'Tooth-coloured restorations that repair decayed or chipped teeth and restore normal function.',
   'Decayed or damaged tooth structure is removed and replaced with a bonded, tooth-coloured composite material that is shaped and polished to match the natural tooth. Most fillings are completed in a single visit.',
   array['Teeth with early to moderate decay','Small chips or fractures','Replacement of worn or discoloured older fillings'],
   array['Local anaesthetic if required','Removal of decay and preparation of the cavity','Placement and curing of the composite in layers','Bite check, shaping and polishing'],
   array['Natural appearance','Conservative — preserves healthy tooth structure','Usually completed in one appointment'],
   null, false, true, 3),

  ('Root Canal Treatment', 'root-canal-treatment', 'dental',
   'Treatment that saves a tooth with an infected or inflamed nerve, relieving pain and preserving your natural tooth.',
   'When the pulp inside a tooth becomes infected or irreversibly inflamed, root canal treatment removes it, disinfects the canal system and seals it. A crown is often recommended afterwards to protect the tooth. Treatment may be completed over one or more visits depending on the tooth.',
   array['Persistent or severe toothache','Prolonged sensitivity to hot or cold','A tooth with a deep cavity, crack or dental abscess'],
   array['Local anaesthetic and isolation of the tooth','Access to and cleaning of the canal system','Shaping, disinfection and sealing of the canals','A permanent filling and, usually, a crown to protect the tooth'],
   array['Keeps your natural tooth','Relieves infection-related pain','Restores normal biting and chewing once protected'],
   null, false, true, 4),

  ('Tooth Extraction', 'tooth-extraction', 'dental',
   'Careful removal of a tooth that cannot be saved, with clear aftercare and replacement options discussed.',
   'Extraction is considered only when a tooth cannot be restored or is causing problems for the rest of the mouth. The clinician explains why removal is advised, carries it out under local anaesthetic, and discusses options to replace the tooth where appropriate.',
   array['Severely decayed or fractured teeth','Advanced gum disease affecting a specific tooth','Retained baby teeth or orthodontic reasons'],
   array['Assessment and radiograph if needed','Local anaesthetic','Gentle removal of the tooth','Aftercare instructions and a plan to replace the tooth if suitable'],
   array['Removes a source of pain or infection','Protects neighbouring teeth and gums','Clear guidance on bridges, implants or dentures where relevant'],
   null, false, true, 5),

  ('Dental Crowns', 'dental-crowns', 'dental',
   'Custom caps that rebuild and protect a weakened, cracked or root-treated tooth.',
   'A crown covers the whole visible part of a tooth, restoring its shape, strength and appearance. Crowns are commonly used after root canal treatment or when a large filling leaves the remaining tooth vulnerable to fracture.',
   array['Root-treated back teeth','Cracked or heavily filled teeth','Teeth that need a change in shape or shade as part of a wider plan'],
   array['Preparation of the tooth and an impression or scan','Fitting of a temporary crown','Laboratory fabrication of the final crown','Try-in, adjustment and cementation'],
   array['Protects a weak tooth from fracture','Restores comfortable chewing','Natural-looking materials available'],
   null, false, true, 6),

  ('Bridges', 'bridges', 'dental',
   'A fixed way to replace one or more missing teeth by anchoring to the teeth on either side of the gap.',
   'A bridge uses the adjacent teeth as supports for a replacement tooth (or teeth) that is fixed in place. It restores appearance and function without a removable denture. Suitability depends on the health of the supporting teeth.',
   array['One or two adjacent missing teeth','Patients who prefer a fixed, non-removable option','Situations where adjacent teeth would also benefit from crowns'],
   array['Assessment of the supporting teeth','Preparation and impression or scan','Temporary bridge while the final one is made','Fit and cementation of the definitive bridge'],
   array['Fixed replacement — nothing to remove','Restores an even smile and bite','Completed without surgery'],
   null, false, true, 7),

  ('Dental Implants', 'dental-implants', 'dental',
   'A titanium post placed in the jaw to support a single crown, bridge or denture without affecting neighbouring teeth.',
   'An implant replaces the root of a missing tooth. Once it has integrated with the bone, a crown, bridge or denture is attached. Treatment is planned in stages and requires adequate bone and healthy gums; the clinician will assess whether it is appropriate for you.',
   array['Single or multiple missing teeth','Patients wanting to avoid preparing adjacent teeth','Denture wearers seeking more stability'],
   array['Detailed assessment including radiographs','Surgical placement of the implant under local anaesthetic','Healing and integration period','Attachment of the final crown, bridge or denture'],
   array['Does not rely on neighbouring teeth','Stable support for crowns, bridges or dentures','Helps maintain jawbone in the area'],
   '/images/dental/smile-designing.jpg', true, true, 8),

  ('Braces', 'braces', 'dental',
   'Fixed orthodontic appliances that straighten crowded, spaced or misaligned teeth and correct the bite.',
   'Braces apply gentle, continuous pressure to move teeth into a healthier, more even position over time. After an orthodontic assessment, the clinician will advise whether braces, aligners or another approach best suits your goals.',
   array['Crowded or protruding teeth','Gaps between teeth','Bite problems affecting function or cleaning'],
   array['Orthodontic assessment, photographs and impressions or scans','Fitting of the braces','Regular adjustment visits','Retainers to hold the result once treatment is complete'],
   array['Teeth that are easier to clean','Improved bite and function','A more even smile'],
   null, false, true, 9),

  ('Clear Aligners', 'clear-aligners', 'dental',
   'A series of removable, near-invisible trays that gradually align the teeth — a discreet alternative to braces for suitable cases.',
   'Clear aligners are custom-made trays worn for most of the day and changed on a set schedule. They can address a range of mild to moderate alignment concerns. Suitability is confirmed at an orthodontic assessment.',
   array['Mild to moderate crowding or spacing','Adults and older teenagers who prefer a discreet option','Minor relapse after previous orthodontic treatment'],
   array['Assessment and digital scan','Review of the planned tooth movements','Sequential wear of the aligner trays','Retainers to maintain the final position'],
   array['Discreet appearance','Removable for eating and cleaning','Planned, predictable stages'],
   '/images/dental/clear-aligners.jpg', false, true, 10),

  ('Teeth Whitening', 'teeth-whitening', 'dental',
   'Professionally supervised whitening to lighten discoloured teeth safely, with custom trays for home top-ups.',
   'After confirming your teeth and gums are healthy, the clinician provides a professional whitening system with custom-fitted trays and clear instructions. Results vary between individuals and depend on the starting shade and cause of discolouration.',
   array['Generalised yellowing or dulling with age','Staining from tea, coffee or tobacco','Patients preparing for a special occasion'],
   array['Check that teeth and gums are healthy','Impressions or scan for custom trays','Supervised whitening with review','Advice on maintaining the result'],
   array['Custom trays for comfort and even coverage','Clinician supervision throughout','Guidance to reduce sensitivity'],
   null, false, true, 11),

  ('Smile Designing', 'smile-designing', 'dental',
   'A planned, whole-smile approach that combines treatments such as whitening, alignment, veneers or crowns to meet your goals.',
   'Smile designing starts with a conversation about what you would like to change, followed by photographs, records and a preview of possible outcomes. The clinician then proposes a combination of treatments and a sequence. This is elective cosmetic treatment and outcomes vary between individuals.',
   array['Patients unhappy with the shape, shade or alignment of their smile','People planning treatment before a wedding or event','Those wanting to understand their options before committing'],
   array['Discussion of goals and smile analysis','Photographs, scans and a proposed plan','Preview or mock-up where appropriate','Staged treatment and review'],
   array['A coordinated plan rather than isolated treatments','Clear expectations set before starting','Sequenced to your priorities and budget'],
   '/images/dental/smile-designing.jpg', true, true, 12),

  ('Pediatric Dentistry', 'pediatric-dentistry', 'dental',
   'Gentle preventive and restorative care for children in a calm, reassuring environment.',
   'Children''s appointments focus on prevention, building positive experiences and treating problems early. The clinician explains everything in child-friendly language and involves parents in home-care planning.',
   array['First dental visits for young children','Routine check-ups and fluoride advice','Treatment of decay in baby or young permanent teeth'],
   array['Friendly introduction and examination','Preventive advice on diet and brushing','Fissure sealants or fillings where needed','A recall interval based on the child''s risk'],
   array['Early habits that protect adult teeth','A positive first experience of dentistry','Parents included in prevention planning'],
   '/images/dental/pediatric-dentistry.jpg', true, true, 13),

  ('Gum Care', 'gum-care', 'dental',
   'Assessment and treatment of gum inflammation and periodontal disease to keep the foundations of your teeth healthy.',
   'Gum care ranges from treating early gingivitis with a thorough clean and improved home care, to managing periodontal disease with deeper cleaning and regular maintenance. The clinician measures gum health and monitors it over time.',
   array['Bleeding, swollen or receding gums','Persistent bad breath','Patients with a history of gum disease'],
   array['Periodontal assessment and charting','Professional cleaning above and below the gum line','Home-care coaching','A maintenance schedule to keep gums stable'],
   array['Helps retain teeth long term','Reduces bleeding and inflammation','Objective monitoring of gum health'],
   null, false, true, 14),

  ('Full Mouth Rehabilitation', 'full-mouth-rehabilitation', 'dental',
   'A comprehensive plan to restore function, comfort and appearance when several teeth need treatment.',
   'Full mouth rehabilitation coordinates multiple treatments — which may include fillings, crowns, bridges, implants, gum treatment and bite management — into a single sequenced plan. It is tailored to your needs, priorities and budget after detailed records.',
   array['Extensive wear, decay or missing teeth','Long-standing bite or jaw discomfort','Patients wanting to address everything in a structured way'],
   array['Comprehensive examination and records','Diagnostic planning and discussion of options','Staged treatment in an agreed order','Long-term maintenance'],
   array['One coordinated plan','Function and comfort addressed together','Clear staging and cost visibility'],
   null, false, true, 15),

  ('Cosmetic Dentistry', 'cosmetic-dentistry', 'dental',
   'Elective treatments — such as bonding, veneers, whitening and reshaping — to refine the appearance of your smile.',
   'Cosmetic treatments are planned around what you want to change, with the clinician explaining what is realistic for your teeth. Healthy teeth and gums are confirmed first. As elective treatment, results vary and are discussed individually.',
   array['Chipped, worn or slightly uneven teeth','Discolouration that does not respond to whitening alone','Small gaps or minor shape concerns'],
   array['Smile assessment and discussion of goals','Records and a proposed approach','Treatment such as bonding, veneers or reshaping','Review and maintenance advice'],
   array['Focused on your specific concern','Options from minimal to comprehensive','Realistic expectations set in advance'],
   null, false, true, 16),

  ('Skin Consultation', 'skin-consultation', 'skin',
   'A one-to-one assessment of your skin concern with an explanation of likely causes and suitable next steps.',
   'The clinician reviews your skin history, current routine and concern, examines the affected areas and explains the likely contributing factors. You receive guidance on skincare and, where appropriate, a proposed treatment plan. No diagnosis or treatment is offered online — an in-person evaluation is required.',
   array['Persistent or recurring skin concerns','Uncertainty about which treatment is appropriate','Anyone wanting a structured skincare plan'],
   array['Discussion of your concern and history','Examination of the affected areas','Explanation of likely causes','A written plan for skincare and any recommended treatment'],
   array['Clarity on what is driving your concern','A realistic, prioritised plan','Advice tailored to your skin'],
   null, true, true, 1),

  ('Acne Care', 'acne-care', 'skin',
   'Consultation-led management of active acne and acne-prone skin, planned around severity and skin type.',
   'Acne care begins with an assessment of the type and severity of your acne. The clinician discusses contributing factors and outlines a management plan, which is reviewed over time and adjusted to your response. Suitability of any specific treatment is decided in person.',
   array['Active breakouts on the face, back or chest','Acne that has not settled with over-the-counter products','Concerns about marks left after breakouts'],
   array['Assessment of acne type and severity','Review of skincare, lifestyle and triggers','A staged management plan','Scheduled reviews to track progress'],
   array['A plan matched to your acne, not a generic routine','Ongoing review rather than one-off advice','Guidance on preventing marks and scarring'],
   null, false, true, 2),

  ('Pigmentation Care', 'pigmentation-care', 'skin',
   'Assessment and management of uneven skin tone, dark patches and post-inflammatory marks.',
   'Pigmentation has several causes, including sun exposure, hormonal factors and inflammation. The clinician assesses the pattern and likely cause, and proposes a plan that typically combines sun protection, skincare and, where appropriate, in-clinic treatment.',
   array['Dark patches or blotchy tone','Marks left after acne or injury','Sun-related pigmentation'],
   array['Assessment of the pigmentation pattern','Identification of likely causes and triggers','A combined plan including sun protection','Review and adjustment over time'],
   array['Cause-focused rather than cover-up only','Emphasis on protecting results','Realistic timelines discussed upfront'],
   null, false, true, 3),

  ('Skin Rejuvenation', 'skin-rejuvenation', 'skin',
   'Personalized plans to improve skin texture, dullness and early signs of ageing.',
   'Skin rejuvenation focuses on overall skin quality — texture, brightness and firmness. After assessing your skin, the clinician recommends a combination of skincare and suitable in-clinic treatments, with realistic expectations set in advance.',
   array['Dull or uneven texture','Early fine lines','Patients wanting a maintenance plan for skin health'],
   array['Skin quality assessment','Discussion of goals and constraints','A tailored plan combining skincare and treatment','Periodic review'],
   array['Whole-skin approach rather than a single fix','Plan built around your skin and schedule','Focus on maintainable results'],
   null, false, true, 4),

  ('Scar Care', 'scar-care', 'skin',
   'Evaluation and management of acne scars and other scars to improve texture and appearance.',
   'Scars differ in type and depth, and respond differently to treatment. The clinician assesses your scars, explains what is realistically achievable, and proposes a plan that may combine several approaches over a number of sessions.',
   array['Acne scarring','Scars from injury or surgery that have matured','Uneven texture from previous skin conditions'],
   array['Assessment of scar type and maturity','Explanation of realistic outcomes','A staged treatment plan','Review between sessions'],
   array['Honest guidance on what treatment can achieve','Combination approach where appropriate','Progress reviewed at each stage'],
   null, false, true, 5),

  ('Cosmetic Skin Treatments', 'cosmetic-skin-treatments', 'skin',
   'A range of elective in-clinic skin treatments, recommended only after an in-person assessment.',
   'This category covers elective skin treatments offered at the clinic. Which treatment is appropriate — if any — depends on your skin, concern and medical history, and is decided during consultation. The clinician will explain the procedure, aftercare and expected course of results before you proceed.',
   array['Patients who have had a skin consultation','Specific concerns discussed with the clinician','Those seeking a maintenance treatment plan'],
   array['In-person assessment and suitability check','Explanation of the specific treatment and aftercare','Treatment session(s) as planned','Follow-up and review'],
   array['Recommended only when appropriate','Full explanation before proceeding','Structured follow-up'],
   null, false, true, 6),

  ('Hair Consultation', 'hair-consultation', 'hair',
   'A structured assessment of hair fall or scalp concerns, with an explanation of likely causes and next steps.',
   'The clinician takes a history, examines your scalp and hair, and discusses possible contributing factors such as nutrition, general health, stress and hereditary patterns. You receive guidance and, where appropriate, a plan for further evaluation or treatment. Assessment is in person only.',
   array['Noticeable increase in hair fall','Thinning or changes in hair density','Scalp itching, flaking or irritation'],
   array['History and discussion of your concern','Examination of the scalp and hair','Explanation of likely contributing factors','A plan for any further evaluation or treatment'],
   array['A clearer understanding of the cause','Advice specific to your pattern','A realistic plan and timeline'],
   null, true, true, 1),

  ('Hair Fall Care', 'hair-fall-care', 'hair',
   'Consultation-led management of excessive hair fall, addressing contributing factors alongside any treatment.',
   'Hair fall often has more than one cause. After assessment, the clinician outlines a management plan that addresses general health and scalp care as well as any specific treatment considered appropriate for your situation, with reviews to track change.',
   array['Ongoing or seasonal increases in shedding','Hair fall after illness, stress or dietary change','Early thinning where the pattern is unclear'],
   array['Assessment of the pattern and likely causes','Advice on nutrition, scalp care and general health','Any recommended treatment explained in full','Scheduled reviews'],
   array['Addresses causes, not just symptoms','Realistic expectations set early','Progress reviewed objectively'],
   null, false, true, 2),

  ('Scalp Care', 'scalp-care', 'hair',
   'Assessment and management of scalp conditions such as flaking, itching and irritation.',
   'A healthy scalp supports healthy hair. The clinician examines the scalp, identifies the likely condition and recommends a care plan. Persistent or severe conditions may need ongoing management.',
   array['Persistent dandruff or flaking','Itchy or irritated scalp','Redness or discomfort affecting daily life'],
   array['Scalp examination','Identification of the likely condition','A care and treatment plan','Review to confirm improvement'],
   array['Targeted rather than generic advice','Comfort and symptom relief','Support for overall hair health'],
   null, false, true, 3),

  ('Hair Restoration Treatments', 'hair-restoration-treatments', 'hair',
   'Elective in-clinic treatments for suitable patients, recommended only after a full hair assessment.',
   'Where appropriate, the clinic offers in-clinic treatments intended to support hair density and scalp health. Suitability depends on the cause and stage of hair loss and your medical history, and is decided during consultation. The clinician explains the treatment course, what results are realistic and the aftercare involved.',
   array['Patients who have completed a hair consultation','Specific patterns of hair loss discussed with the clinician','Those wanting a structured, reviewed treatment plan'],
   array['Full assessment and suitability check','Explanation of the treatment and expected course','Treatment sessions as planned','Review of response and maintenance planning'],
   array['Recommended only when suitable','Clear, realistic expectations','Structured follow-up'],
   null, false, true, 4),

  ('Hair & Scalp Health', 'hair-and-scalp-health', 'hair',
   'Ongoing guidance and periodic review to maintain hair and scalp condition over time.',
   'For patients who want to keep their hair and scalp in good condition, the clinic offers periodic review and maintenance advice built around your routine, general health and any previous treatment.',
   array['Maintenance after a course of treatment','Patients with a history of scalp conditions','Anyone wanting a proactive plan'],
   array['Baseline assessment','A maintenance and monitoring plan','Periodic review visits','Adjustment as needed'],
   array['Keeps gains from earlier treatment','Early detection of new issues','Advice that fits your routine'],
   null, false, true, 5),

  ('Aesthetic Consultation', 'aesthetic-consultation', 'aesthetic',
   'A private discussion of your aesthetic goals with an honest assessment of suitable, realistic options.',
   'The clinician listens to what you would like to change, examines the relevant areas and explains which options — if any — are appropriate for you. The focus is on realistic outcomes, safety and a plan you are comfortable with. Nothing is recommended or carried out without an in-person assessment.',
   array['Anyone considering a facial aesthetic treatment','Patients unsure which option suits their goals','Those wanting an unbiased opinion before deciding'],
   array['Discussion of your goals and concerns','Assessment of the relevant areas','Explanation of suitable options and realistic outcomes','A written plan, with no pressure to proceed'],
   array['Honest guidance on what is achievable','Safety and suitability assessed first','A plan at your pace'],
   null, true, true, 1),

  ('Facial Aesthetic Treatments', 'facial-aesthetic-treatments', 'aesthetic',
   'Elective facial treatments planned individually after assessment, with full information before you decide.',
   'This category covers elective facial aesthetic treatments offered at the clinic. Which treatment is appropriate depends on your anatomy, goals and medical history and is determined during consultation. The clinician explains the procedure, expected results, longevity and aftercare, and answers your questions before any treatment is planned.',
   array['Patients who have had an aesthetic consultation','Specific concerns discussed with the clinician','Those seeking a considered, staged approach'],
   array['In-person assessment and suitability check','Full explanation of the treatment and aftercare','Treatment as planned','Review appointment'],
   array['Individualised planning','Complete information before consent','Structured review'],
   null, false, true, 2),

  ('Cosmetic Treatments', 'cosmetic-treatments', 'aesthetic',
   'A range of elective cosmetic procedures, each recommended only where appropriate and fully explained beforehand.',
   'The clinic offers selected elective cosmetic treatments. Suitability, expected outcomes and any risks are discussed during consultation so you can make an informed decision. Treatments are carried out only after assessment and consent.',
   array['Patients who have completed a consultation','Goals that have been discussed and assessed','Those comfortable proceeding after full information'],
   array['Assessment and discussion of options','Explanation of outcomes, longevity and aftercare','Treatment as agreed','Follow-up review'],
   array['Recommended only when appropriate','Informed decision-making','Aftercare and review included'],
   null, false, true, 3),

  ('Personalized Aesthetic Care', 'personalized-aesthetic-care', 'aesthetic',
   'A longer-term aesthetic plan combining treatments and skincare, reviewed regularly and adjusted to your goals.',
   'For patients who want a coordinated plan rather than single treatments, the clinician develops a personalised programme that sequences treatments and skincare over time, with regular reviews to keep it aligned with your goals and budget.',
   array['Patients with more than one goal','Those who prefer a gradual, planned approach','Anyone wanting ongoing review and adjustment'],
   array['Comprehensive assessment and goal-setting','A sequenced plan across treatments and skincare','Staged appointments','Regular review and refinement'],
   array['A single coordinated plan','Paced to your comfort and budget','Adjusted as your goals evolve'],
   null, false, true, 4)
on conflict (slug) do nothing;
