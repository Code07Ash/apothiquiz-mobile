import { useState } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity, 
  StyleSheet, 
  SafeAreaView,
  StatusBar,
  Linking
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { chapters } from '../../src/data/chapters';

export default function ExploreScreen() {
  const router = useRouter();
  const [selectedChapter, setSelectedChapter] = useState(null);

  const studyResources = [
    {
      title: "Pharmacology Basics",
      description: "Understanding drug classifications and mechanisms",
      url: "https://www.ncbi.nlm.nih.gov/books/NBK547659/",
      icon: "PB",
      color: "#3498DB"
    },
    {
      title: "Drug Interaction Guide",
      description: "Learn about drug interactions and contraindications",
      url: "https://www.drugs.com/drug_interactions.html",
      icon: "DI",
      color: "#E74C3C"
    },
    {
      title: "Clinical Pharmacology",
      description: "Advanced concepts in clinical drug use",
      url: "https://www.pharmacologyeducation.org/",
      icon: "CP",
      color: "#27AE60"
    },
    {
      title: "Drug Classification Chart",
      description: "Visual guide to major drug categories",
      url: "https://www.rxlist.com/drug-classes/drugs-index.htm",
      icon: "DC",
      color: "#F39C12"
    }
  ];

  const quickFacts = [
    "There are over 20,000 prescription drugs approved by the FDA",
    "Antibiotics work by targeting bacterial cell walls or proteins",
    "Beta-blockers reduce heart rate and blood pressure",
    "Insulin helps cells absorb glucose from the bloodstream",
    "NSAIDs reduce inflammation by blocking COX enzymes",
    "Diuretics help remove excess fluid from the body"
  ];

  const openResource = async (url) => {
    try {
      await Linking.openURL(url);
    } catch (error) {
      console.error('Error opening URL:', error);
    }
  };

  const ChapterDetailCard = ({ chapter }) => (
    <View style={styles.chapterDetailCard}>
      <LinearGradient
        colors={[chapter.color, chapter.color + '80']}
        style={styles.chapterDetailGradient}
      >
        <View style={styles.chapterDetailHeader}>
          <Text style={styles.chapterDetailIcon}>{chapter.icon}</Text>
          <Text style={styles.chapterDetailTitle}>{chapter.title}</Text>
        </View>
        <Text style={styles.chapterDetailDescription}>{chapter.description}</Text>
        
        <View style={styles.drugsList}>
          <Text style={styles.drugsListTitle}>Drugs in this chapter:</Text>
          {chapter.drugs.map((drug, index) => (
            <View key={index} style={styles.drugItem}>
              <Text style={styles.drugName}>{drug.name}</Text>
              <Text style={styles.drugClass}>{drug.correctClass}</Text>
              <View style={[styles.difficultyBadge, { 
                backgroundColor: drug.difficulty === 'easy' ? '#27AE60' : 
                                drug.difficulty === 'medium' ? '#F39C12' : '#E74C3C' 
              }]}>
                <Text style={styles.difficultyText}>{drug.difficulty}</Text>
              </View>
            </View>
          ))}
        </View>

        <TouchableOpacity
          style={styles.studyButton}
          onPress={() => router.push({
            pathname: '/quiz',
            params: { mode: 'gamified', chapterId: chapter.id.toString() }
          })}
        >
          <Text style={styles.studyButtonText}>Start Gamified Quiz</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.studyButton, { backgroundColor: 'rgba(255,255,255,0.2)' }]}
          onPress={() => router.push({
            pathname: '/quiz',
            params: { mode: 'control', chapterId: chapter.id.toString() }
          })}
        >
          <Text style={styles.studyButtonText}>Study Mode</Text>
        </TouchableOpacity>
      </LinearGradient>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#2C3E50" />
      
      <LinearGradient
        colors={['#2C3E50', '#3498DB']}
        style={styles.header}
      >
        <Text style={styles.headerTitle}>Explore & Learn</Text>
        <Text style={styles.headerSubtitle}>Discover drug classification knowledge</Text>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Facts</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.factsContainer}>
            {quickFacts.map((fact, index) => (
              <View key={index} style={styles.factCard}>
                <Text style={styles.factText}>{fact}</Text>
              </View>
            ))}
          </ScrollView>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Study Resources</Text>
          {studyResources.map((resource, index) => (
            <TouchableOpacity
              key={index}
              style={styles.resourceCard}
              onPress={() => openResource(resource.url)}
            >
              <View style={[styles.resourceIcon, { backgroundColor: resource.color }]}>
                <Text style={styles.resourceIconText}>{resource.icon}</Text>
              </View>
              <View style={styles.resourceContent}>
                <Text style={styles.resourceTitle}>{resource.title}</Text>
                <Text style={styles.resourceDescription}>{resource.description}</Text>
              </View>
              <Text style={styles.resourceArrow}>→</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Chapter Explorer</Text>
          {selectedChapter ? (
            <View>
              <TouchableOpacity
                style={styles.backButton}
                onPress={() => setSelectedChapter(null)}
              >
                <Text style={styles.backButtonText}>← Back to Chapters</Text>
              </TouchableOpacity>
              <ChapterDetailCard chapter={selectedChapter} />
            </View>
          ) : (
            <View style={styles.chaptersGrid}>
              {chapters.map(chapter => (
                <TouchableOpacity
                  key={chapter.id}
                  style={styles.chapterExploreCard}
                  onPress={() => setSelectedChapter(chapter)}
                >
                  <LinearGradient
                    colors={[chapter.color, chapter.color + '80']}
                    style={styles.chapterExploreGradient}
                  >
                    <Text style={styles.chapterExploreIcon}>{chapter.icon}</Text>
                    <Text style={styles.chapterExploreTitle}>{chapter.title}</Text>
                    <Text style={styles.chapterExploreDrugs}>{chapter.drugs.length} drugs</Text>
                  </LinearGradient>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Learning Tips</Text>
          <View style={styles.tipsContainer}>
            <View style={styles.tipCard}>
              <Text style={styles.tipIcon}>MT</Text>
              <Text style={styles.tipTitle}>Use Memory Techniques</Text>
              <Text style={styles.tipDescription}>
                Create mnemonics and associations to remember drug classifications better.
              </Text>
            </View>
            
            <View style={styles.tipCard}>
              <Text style={styles.tipIcon}>PR</Text>
              <Text style={styles.tipTitle}>Practice Regularly</Text>
              <Text style={styles.tipDescription}>
                Consistent practice with spaced repetition improves long-term retention.
              </Text>
            </View>
            
            <View style={styles.tipCard}>
              <Text style={styles.tipIcon}>TM</Text>
              <Text style={styles.tipTitle}>Try Both Modes</Text>
              <Text style={styles.tipDescription}>
                Compare your performance between gamified and study modes to see what works best.
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.actionsContainer}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => router.push('/')}
          >
            <LinearGradient
              colors={['#FF6B6B', '#FF8E53']}
              style={styles.actionGradient}
            >
              <Text style={styles.actionButtonText}>Start Learning</Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => router.push('/analytics')}
          >
            <LinearGradient
              colors={['#4ECDC4', '#44A08D']}
              style={styles.actionGradient}
            >
              <Text style={styles.actionButtonText}>View Progress</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    paddingTop: 20,
    paddingBottom: 30,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 5,
  },
  headerSubtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.8)',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  section: {
    marginVertical: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 15,
  },
  factsContainer: {
    paddingVertical: 5,
  },
  factCard: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 12,
    marginRight: 15,
    width: 250,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  factText: {
    fontSize: 14,
    color: '#2C3E50',
    lineHeight: 20,
  },
  resourceCard: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 12,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  resourceIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  resourceIconText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
  resourceContent: {
    flex: 1,
  },
  resourceTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 3,
  },
  resourceDescription: {
    fontSize: 14,
    color: '#7F8C8D',
  },
  resourceArrow: {
    fontSize: 18,
    color: '#3498DB',
    fontWeight: 'bold',
  },
  chaptersGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  chapterExploreCard: {
    width: '48%',
    borderRadius: 15,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  chapterExploreGradient: {
    padding: 15,
    alignItems: 'center',
    minHeight: 120,
    justifyContent: 'center',
  },
  chapterExploreIcon: {
    fontSize: 20,
    marginBottom: 8,
    fontWeight: 'bold',
    color: 'white',
  },
  chapterExploreTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginBottom: 5,
  },
  chapterExploreDrugs: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
  },
  backButton: {
    backgroundColor: 'white',
    padding: 12,
    borderRadius: 10,
    marginBottom: 15,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E8E8E8',
  },
  backButtonText: {
    fontSize: 14,
    color: '#3498DB',
    fontWeight: '600',
  },
  chapterDetailCard: {
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  chapterDetailGradient: {
    padding: 20,
  },
  chapterDetailHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  chapterDetailIcon: {
    fontSize: 20,
    marginRight: 12,
    fontWeight: 'bold',
    color: 'white',
  },
  chapterDetailTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: 'white',
    flex: 1,
  },
  chapterDetailDescription: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.9)',
    marginBottom: 20,
    lineHeight: 22,
  },
  drugsList: {
    marginBottom: 20,
  },
  drugsListTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 10,
  },
  drugItem: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    padding: 12,
    borderRadius: 10,
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  drugName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: 'white',
    flex: 1,
  },
  drugClass: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
    marginRight: 10,
  },
  difficultyBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  difficultyText: {
    fontSize: 10,
    color: 'white',
    fontWeight: 'bold',
  },
  studyButton: {
    backgroundColor: 'rgba(255,255,255,0.3)',
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 10,
  },
  studyButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
  tipsContainer: {
    gap: 12,
  },
  tipCard: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  tipIcon: {
    fontSize: 16,
    marginBottom: 10,
    fontWeight: 'bold',
    color: '#3498DB',
  },
  tipTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 8,
  },
  tipDescription: {
    fontSize: 14,
    color: '#7F8C8D',
    lineHeight: 20,
  },
  actionsContainer: {
    gap: 15,
    paddingBottom: 30,
  },
  actionButton: {
    borderRadius: 15,
    overflow: 'hidden',
  },
  actionGradient: {
    padding: 18,
    alignItems: 'center',
  },
  actionButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
});