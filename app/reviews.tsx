import React, { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Text, Card, Button, TextInput, Rating, Surface } from 'react-native-paper';
import { useRouter, useLocalSearchParams } from 'expo-router';

export default function ReviewsScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [newReview, setNewReview] = useState('');
  const [rating, setRating] = useState(0);

  // Örnek yorumlar (normalde API'den gelecek)
  const [reviews, setReviews] = useState([
    {
      id: 1,
      user: 'Ahmet Y.',
      rating: 5,
      comment: 'Harika bir deneyimdi. Kesinlikle tekrar geleceğim.',
      date: '2024-02-15',
    },
    {
      id: 2,
      user: 'Ayşe K.',
      rating: 4,
      comment: 'Çok güzel bir yer, sadece biraz kalabalıktı.',
      date: '2024-02-10',
    },
  ]);

  const handleSubmitReview = () => {
    if (newReview.trim() && rating > 0) {
      const newReviewObj = {
        id: reviews.length + 1,
        user: 'Mevcut Kullanıcı',
        rating,
        comment: newReview,
        date: new Date().toISOString().split('T')[0],
      };
      setReviews([newReviewObj, ...reviews]);
      setNewReview('');
      setRating(0);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Surface style={styles.reviewForm}>
        <Text variant="titleLarge" style={styles.title}>Yorum Yap</Text>
        <Rating
          value={rating}
          onValueChange={setRating}
          style={styles.rating}
        />
        <TextInput
          mode="outlined"
          label="Yorumunuz"
          value={newReview}
          onChangeText={setNewReview}
          multiline
          numberOfLines={4}
          style={styles.input}
        />
        <Button
          mode="contained"
          onPress={handleSubmitReview}
          disabled={!newReview.trim() || rating === 0}
        >
          Yorumu Gönder
        </Button>
      </Surface>

      <Text variant="titleLarge" style={styles.sectionTitle}>
        Diğer Yorumlar
      </Text>

      {reviews.map((review) => (
        <Card key={review.id} style={styles.reviewCard}>
          <Card.Content>
            <View style={styles.reviewHeader}>
              <Text variant="titleMedium">{review.user}</Text>
              <Text variant="bodySmall">{review.date}</Text>
            </View>
            <Rating
              value={review.rating}
              readonly
              style={styles.reviewRating}
            />
            <Text variant="bodyMedium">{review.comment}</Text>
          </Card.Content>
        </Card>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  reviewForm: {
    padding: 16,
    margin: 16,
    borderRadius: 8,
    elevation: 2,
  },
  title: {
    marginBottom: 16,
  },
  rating: {
    marginBottom: 16,
  },
  input: {
    marginBottom: 16,
  },
  sectionTitle: {
    margin: 16,
    marginBottom: 8,
  },
  reviewCard: {
    margin: 16,
    marginTop: 0,
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  reviewRating: {
    marginBottom: 8,
  },
}); 