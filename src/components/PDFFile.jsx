import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
} from '@react-pdf/renderer';

const styles = StyleSheet.create({
  body: {
    paddingTop: 35,
    paddingBottom: 65,
    paddingHorizontal: 35,
    fontFamily: 'Helvetica',
  },
  header: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  author: {
    fontSize: 12,
    textAlign: 'center',
    marginBottom: 20,
    color: 'gray',
  },
  authorName: {
    fontSize: 12,
    color: 'blue',
  },
  reviewImage: {
    width: '100%',
    height: 200,
    marginBottom: 20,
  },
  reviewText: {
    fontSize: 12,
    marginBottom: 20,
    textAlign: 'justify',
    lineHeight: 1.4,
  },
  reviewData: {
    fontSize: 16,
    marginBottom: 20,
    color: '#333',
  },
  reviewItem: {
    marginBottom: 10,
  },
  rating: {
    color: '#ccc',
    fontSize: 12,
  },
  pageNumber: {
    position: 'absolute',
    fontSize: 12,
    bottom: 30,
    left: 0,
    right: 0,
    textAlign: 'center',
    color: 'grey',
  },
});

function PDFFile({ post, t, postData }) {
  return (
    <Document>
      <Page style={styles.body}>
        <Text style={styles.header} fixed>
          {post.reviewName}
        </Text>
        <Text style={styles.author}>
          {t('reviews.postBy')}: {post.author.firstName} {post.author.lastName}
        </Text>
        <Image
          style={styles.reviewImage}
          src={`http://localhost:4000/images/${post.image}`}
        />
        <Text style={styles.reviewText}>{t('reviews.reviewData')}</Text>

        {postData.map((data, index) => (
          <View key={index} style={styles.reviewItem}>
            <Text style={styles.authorName}>
              {data.author.firstName} {data.author.lastName}
            </Text>
            <Text>{data.text}</Text>
            <Text style={styles.rating}>{`Rating: ${data.rating}`}</Text>
          </View>
        ))}

        <Text
          style={styles.pageNumber}
          render={({ pageNumber, totalPages }) =>
            `${pageNumber} / ${totalPages}`
          }
          fixed
        />
      </Page>
    </Document>
  );
}

export default PDFFile;
