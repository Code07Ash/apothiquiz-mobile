# Med Classify - Enhanced Gamified Learning App

Med Classify is a comprehensive gamified mobile learning application designed to support the classification of pharmaceutical drugs through interactive quizzes. This enhanced version includes advanced features for research evaluation comparing gamified vs non-gamified learning approaches.

## Features

### Core Functionality
- **Dual Learning Modes**: Gamified mode with points, streaks, and achievements vs Study mode for focused learning
- **Chapter-Based Learning**: 5 comprehensive drug categories with 15+ medications
- **Progress Tracking**: Detailed analytics and performance metrics
- **Adaptive Scoring**: Bonus points for speed, difficulty, and streaks

### Gamified Mode Features
- **Dynamic Scoring System**: Base points + bonus multipliers
- **Streak System**: Consecutive correct answers with visual feedback
- **Speed Bonuses**: Rewards for quick thinking
- **Achievement System**: Unlockable badges and milestones
- **Hint System**: Contextual help with drug descriptions
- **Real-time Feedback**: Animated score updates and bonus notifications

### Study Mode Features
- **Clean Interface**: Distraction-free learning environment
- **Progress Indicators**: Clear completion tracking
- **Focus on Accuracy**: Simplified scoring for learning emphasis
- **Detailed Results**: Comprehensive performance analysis

### Analytics & Research
- **Comprehensive Analytics**: Performance comparison between modes
- **Progress Tracking**: Chapter completion and accuracy rates
- **Session History**: Detailed quiz session records
- **User Feedback**: Built-in feedback collection system
- **Data Export**: Research-ready performance metrics

## Drug Categories

1. **Antibiotics & Antimicrobials**
   - Amoxicillin, Ciprofloxacin, Azithromycin

2. **Pain Management**
   - Paracetamol, Ibuprofen, Morphine

3. **Cardiovascular Drugs**
   - Atenolol, Losartan, Simvastatin

4. **Diabetes Management**
   - Metformin, Insulin, Glipizide

5. **Gastrointestinal Drugs**
   - Omeprazole, Ranitidine, Loperamide

## Scoring System

### Gamified Mode
- **Base Points**: 100 per correct answer
- **Streak Bonuses**: 1.2x (3+), 1.5x (5+), 2.0x (10+)
- **Speed Bonuses**: 1.3x (<5s), 1.5x (<3s)
- **Difficulty Bonuses**: 1.2x (medium), 1.5x (hard)
- **Achievements**: Special milestone rewards

### Study Mode
- **Base Points**: 10 per correct answer
- **Focus on Learning**: No distracting bonuses
- **Clear Progress**: Simple accuracy tracking

## Achievement System

- **First Success**: Complete first question correctly
- **On Fire**: Achieve 5+ question streak
- **Unstoppable**: Achieve 10+ question streak
- **Speed Demon**: Multiple fast answers
- **Chapter Master**: Perfect chapter completion
- **Knowledge Seeker**: Complete multiple sessions

## Technology Stack

- **Framework**: Expo (React Native)
- **Language**: TypeScript/JavaScript
- **Navigation**: Expo Router
- **Storage**: AsyncStorage
- **UI**: React Native with Linear Gradients
- **Animations**: React Native Reanimated
- **Haptics**: Expo Haptics

## Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Expo CLI
- iOS Simulator or Android Emulator (optional)

### Installation Steps

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd med-classify
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npx expo start
   ```

4. **Run on device/simulator**
   - Press `i` for iOS Simulator
   - Press `a` for Android Emulator
   - Press `w` for Web Browser
   - Scan QR code with Expo Go app on physical device

## Research Integration

### Data Collection
- **Performance Metrics**: Score, accuracy, response time, streaks
- **User Behavior**: Session duration, mode preference, chapter progress
- **Feedback Data**: User experience ratings and qualitative feedback
- **Comparative Analysis**: Gamified vs Study mode effectiveness

### Analytics Features
- **Overview Dashboard**: Key performance indicators
- **Chapter Progress**: Individual category mastery
- **Mode Comparison**: Side-by-side performance analysis
- **Session History**: Detailed activity logs

## Usage Guide

### For Students
1. **Choose Learning Mode**: Select Gamified or Study mode based on preference
2. **Select Chapter**: Pick specific drug category or mixed quiz
3. **Complete Quiz**: Answer classification questions
4. **Review Results**: Analyze performance and achievements
5. **Track Progress**: Monitor improvement over time

### For Researchers
1. **Data Collection**: Built-in analytics capture all user interactions
2. **Performance Comparison**: Compare effectiveness between modes
3. **User Feedback**: Collect qualitative feedback through integrated forms
4. **Export Data**: Access comprehensive performance metrics

## Configuration

### Customizing Content
- **Add Drugs**: Modify `src/data/chapters.js`
- **Adjust Scoring**: Update `src/utils/scoring.js`
- **Change Themes**: Edit `constants/theme.ts`

### Research Settings
- **Analytics Tracking**: Configure in `src/services/logger.js`
- **Feedback Forms**: Customize in `app/feedback.tsx`
- **Data Export**: Extend `src/utils/storage.js`

## Performance Optimization

- **Lazy Loading**: Components load on demand
- **Efficient Storage**: Optimized AsyncStorage usage
- **Smooth Animations**: Hardware-accelerated transitions
- **Memory Management**: Proper cleanup and state management

## Testing

### Manual Testing Checklist
- [ ] Both learning modes function correctly
- [ ] Scoring system calculates bonuses accurately
- [ ] Progress tracking persists between sessions
- [ ] Analytics display correct data
- [ ] Feedback submission works
- [ ] App performs well on different devices

### Automated Testing (Future Enhancement)
- Unit tests for scoring calculations
- Integration tests for data persistence
- UI tests for user interactions

## Deployment

### Development Build
```bash
npx expo start
```

### Production Build
```bash
# iOS
npx expo build:ios

# Android
npx expo build:android

# Web
npx expo export:web
```

## Research Notes

This application serves as the core artifact for applied research evaluating gamified vs non-gamified learning effectiveness in pharmaceutical education. Key research metrics include:

- **Learning Outcomes**: Accuracy improvement over time
- **Engagement Levels**: Session duration and frequency
- **User Preference**: Mode selection and feedback
- **Knowledge Retention**: Long-term performance tracking

## Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/enhancement`)
3. Commit changes (`git commit -am 'Add new feature'`)
4. Push to branch (`git push origin feature/enhancement`)
5. Create Pull Request

## License

This project is developed for academic research purposes. Please contact the author for usage permissions.

## Author

Developed as an Applied Research Project for MSc in Information Systems with Computing.

## Support

For technical issues or research inquiries, please create an issue in the repository or contact the development team.

---

**Med Classify** - Advancing pharmaceutical education through gamified learning!