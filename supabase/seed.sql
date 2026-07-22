-- Class8th Database Seed Script (Step 9)

-- Seed Simulations Data
INSERT INTO public.simulations (title, subject, description, thumbnail_url, difficulty, status, embed_url) VALUES
('PhET Forces and Motion', 'Physics', 'Explore the forces at work when pulling against a cart, and pushing a refrigerator, crate, or person.', '/simulations/forces-motion.png', 'Easy', 'published', 'https://phet.colorado.edu/sims/html/forces-and-motion-basics/latest/forces-and-motion-basics_all.html'),
('Acid-Base Solutions', 'Chemistry', 'How do strong and weak acids differ? Use lab tools on your computer to find out!', '/simulations/acids-bases.png', 'Medium', 'published', 'https://phet.colorado.edu/sims/html/acid-base-solutions/latest/acid-base-solutions_all.html'),
('Gravity and Orbits', 'Physics', 'Move the sun, earth, moon and space station to see how it affects their gravitational forces and orbital paths.', '/simulations/gravity.png', 'Medium', 'published', 'https://phet.colorado.edu/sims/html/gravity-and-orbits/latest/gravity-and-orbits_all.html'),
('Rational Numbers Visualizer', 'Mathematics', 'Interactive fraction and rational number line plotter.', '/simulations/maths.png', 'Easy', 'published', 'https://phet.colorado.edu/sims/html/fraction-matcher/latest/fraction-matcher_all.html');

-- Seed Digital Library Documents
INSERT INTO public.documents (title, description, category, subject, file_path, file_type, thumbnail_url, allow_view, allow_download, status) VALUES
('Class 8 Science Syllabus', 'Complete academic syllabus and mark distribution for Science.', 'Syllabus', 'Science', 'syllabus-science-class8.pdf', 'pdf', '/icons/pdf.png', true, true, 'published'),
('Maths Chapter 1 Notes', 'Revision notes on Rational Numbers.', 'Notes', 'Mathematics', 'maths-ch1-rational-numbers.pdf', 'pdf', '/icons/pdf.png', true, false, 'published'),
('Physics Motion Formula Sheet', 'Essential formulas for forces, speed, velocity, and pressure.', 'Notes', 'Physics', 'physics-formulas-class8.pdf', 'pdf', '/icons/pdf.png', true, true, 'published'),
('NCERT Class 8 Science Textbook', 'Full official textbook digital copy.', 'Textbooks', 'Science', 'ncert-science-class8.pdf', 'pdf', '/icons/pdf.png', true, true, 'published');

-- Seed Quizzes Data
INSERT INTO public.quizzes (id, title, description, subject, time_limit_minutes, passing_score, shuffle_questions, show_explanations, status) VALUES
('00000000-0000-0000-0000-000000000001', 'Rational Numbers Quiz', 'Test your understanding of rational numbers and their properties.', 'Mathematics', 15, 70, true, true, 'published'),
('00000000-0000-0000-0000-000000000002', 'Forces & Pressure Practice Test', 'Interactive test covering force vectors, friction, and pressure.', 'Physics', 20, 75, true, true, 'published');

-- Seed Questions Data
INSERT INTO public.questions (quiz_id, question_text, question_type, options, correct_answer, explanation, points) VALUES
('00000000-0000-0000-0000-000000000001', 'What is the additive identity for rational numbers?', 'mcq', '["0", "1", "-1", "None of these"]'::jsonb, '"0"'::jsonb, 'Zero is the additive identity because adding zero to any number results in the same number.', 10),
('00000000-0000-0000-0000-000000000001', 'Which of the following is a rational number?', 'mcq', '["2/3", "√2", "π", "None"]'::jsonb, '"2/3"'::jsonb, 'A rational number can be expressed as a ratio of two integers p/q where q != 0.', 10),
('00000000-0000-0000-0000-000000000002', 'Friction always opposes relative motion between two surfaces in contact.', 'true_false', '["True", "False"]'::jsonb, '"True"'::jsonb, 'Friction acts in the direction opposite to the intended or actual motion.', 10);

-- Seed Reading RSS Sources
INSERT INTO public.reading_sources (source_name, website_url, feed_url, api_type, category, sync_frequency, active_status) VALUES
('NASA Space News', 'https://nasa.gov', 'https://nasa.gov/rss/news.xml', 'rss', 'Science', 'daily', true),
('National Geographic Kids', 'https://natgeokids.com', 'https://natgeokids.com/feed', 'rss', 'Biology & Earth', 'daily', true),
('MIT Technology Review', 'https://technologyreview.com', 'https://technologyreview.com/feed', 'rss', 'Technology', 'daily', true);
