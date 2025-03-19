
import React from 'react';
import Navbar from '@/components/Navbar';
import { motion } from 'framer-motion';
import AnimatedBackground from '@/components/AnimatedBackground';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, ArrowRight, User, Calendar, Heart, BookOpen, MessageSquare, Share2 } from 'lucide-react';
import { Link } from 'react-router-dom';

const BlogPosts = [
  {
    id: 1,
    title: "Celebrating Our First Fundraising Milestone",
    excerpt: "The Happiness Club has successfully raised over ₹50,000 in its first month of donations, exceeding our initial expectations.",
    content: `
      <p>We are thrilled to announce that the Nilgiri College Happiness Club has successfully raised over ₹50,000 in its first month of donations, far exceeding our initial expectations.</p>
      
      <p>This remarkable achievement would not have been possible without the generous contributions from our students, faculty, alumni, and supporters. Every donation, regardless of size, has helped us move closer to our goal of enhancing student welfare and community development.</p>
      
      <h3>What This Means For Our Community</h3>
      
      <p>With these funds, we can now proceed with several planned initiatives:</p>
      
      <ul>
        <li>Establishing a student emergency fund to provide financial assistance to students facing unexpected hardships</li>
        <li>Upgrading the study spaces in our campus library to create more comfortable and conducive learning environments</li>
        <li>Supporting mental health awareness programs and resources for all campus community members</li>
      </ul>
      
      <p>The overwhelming response to our fundraising campaign demonstrates the strong sense of community and shared values that define Nilgiri College. It shows that we are not just an educational institution but a family that cares for each other's well-being.</p>
      
      <h3>Looking Ahead</h3>
      
      <p>While we celebrate this milestone, we recognize that there is still much more to be done. The Happiness Club will continue its fundraising efforts with renewed enthusiasm, setting even more ambitious goals for the future.</p>
      
      <p>We invite everyone to join us in this journey of making Nilgiri College a happier and more supportive community for all.</p>
    `,
    author: "Dr. Priya Sharma",
    authorRole: "Faculty Advisor, Happiness Club",
    date: "2025-03-15",
    readTime: "5 min read",
    category: "Announcements",
    tags: ["fundraising", "milestone", "community", "student welfare"],
    imageUrl: "/lovable-uploads/dc5f60a7-e574-4624-9179-84afebf69ff9.png"
  },
  {
    id: 2,
    title: "How Your Donations Make a Difference",
    excerpt: "Discover the impact your generous contributions have on student welfare and community development projects.",
    content: `
      <p>At Nilgiri College, we believe in transparency and accountability. We want our donors to see exactly how their contributions are making a difference in our community.</p>
      
      <h3>Tangible Impact</h3>
      
      <p>Your donations have already enabled us to:</p>
      
      <ul>
        <li>Award 15 need-based scholarships to deserving students</li>
        <li>Fund 3 student-led research projects focused on community development</li>
        <li>Establish a peer counseling program with trained student volunteers</li>
        <li>Organize 5 workshops on mental health and wellness</li>
      </ul>
      
      <p>Each of these initiatives has touched lives and created positive change. For instance, Ravi, a second-year engineering student, was able to continue his education despite financial constraints thanks to a scholarship funded by donations. "This support means everything to me," he says. "It's not just about the money; it's knowing that people believe in my potential."</p>
      
      <h3>The Ripple Effect</h3>
      
      <p>The impact of your donations extends beyond immediate benefits. When we support one student, we're not just changing one life – we're affecting countless others through the ripple effect of education and empowerment.</p>
      
      <p>The research projects funded through donations are addressing real-world problems in our local community, from water conservation to waste management. These projects provide valuable learning experiences for our students while contributing to societal progress.</p>
      
      <h3>Join Our Mission</h3>
      
      <p>Whether you're a regular donor or considering your first contribution, know that every rupee counts. Together, we can continue to build a community where happiness, well-being, and academic excellence go hand in hand.</p>
    `,
    author: "Rahul Mehta",
    authorRole: "Student Coordinator, Donations Committee",
    date: "2025-03-10",
    readTime: "6 min read",
    category: "Impact Stories",
    tags: ["impact", "student welfare", "transparency", "community development"],
    imageUrl: "/lovable-uploads/b8adb940-cf0a-4902-89fd-01b317af12a5.png"
  },
  {
    id: 3,
    title: "Upcoming Charity Events This Summer",
    excerpt: "Join us for a series of exciting events planned for this summer to raise funds for our new campus library.",
    content: `
      <p>Summer vacation is just around the corner, but the Happiness Club isn't taking a break! We're excited to announce a series of charity events aimed at raising funds for our new campus library project.</p>
      
      <h3>Calendar of Events</h3>
      
      <ul>
        <li><strong>May 15:</strong> Charity Run - "Run for Knowledge" at the College Sports Ground</li>
        <li><strong>June 5-7:</strong> Annual Book Fair in partnership with leading publishers</li>
        <li><strong>June 20:</strong> Alumni Networking Dinner at Hotel Grandeur</li>
        <li><strong>July 10:</strong> Cultural Night featuring performances by students and local artists</li>
        <li><strong>July 25:</strong> Charity Auction of student and faculty artwork</li>
      </ul>
      
      <h3>The New Library Project</h3>
      
      <p>The planned library expansion will include:</p>
      
      <ul>
        <li>A state-of-the-art digital resource center</li>
        <li>Collaborative study spaces for group projects</li>
        <li>Quiet reading zones with comfortable seating</li>
        <li>A café corner for refreshments</li>
        <li>Extended operating hours to accommodate different study schedules</li>
      </ul>
      
      <p>This project is estimated to cost ₹25 lakhs, and we're aiming to raise at least half of this amount through our summer events and donation drives.</p>
      
      <h3>How to Participate</h3>
      
      <p>There are many ways to get involved:</p>
      
      <ul>
        <li>Register as a participant in any of the events</li>
        <li>Volunteer to help organize the events</li>
        <li>Donate items for the book fair or charity auction</li>
        <li>Sponsor an event or specific aspect of the library project</li>
        <li>Spread the word about our initiatives on social media</li>
      </ul>
      
      <p>Registration forms and volunteer sign-up sheets are available at the Student Affairs Office. You can also register online through our website.</p>
      
      <p>Let's make this summer meaningful by coming together for a cause that will benefit generations of students to come!</p>
    `,
    author: "Neha Joshi",
    authorRole: "Events Coordinator, Happiness Club",
    date: "2025-03-05",
    readTime: "4 min read",
    category: "Events",
    tags: ["events", "summer", "charity", "library", "fundraising"],
    imageUrl: "/placeholder.svg"
  }
];

const BlogPostsList = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {BlogPosts.map((post) => (
        <motion.div
          key={post.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: post.id * 0.1 }}
        >
          <div className="overflow-hidden h-full bg-white/80 backdrop-blur-md rounded-xl shadow-md hover:shadow-lg transition-all">
            <div className="relative h-48 overflow-hidden">
              <img
                src={post.imageUrl}
                alt={post.title}
                className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
              />
              <Badge className="absolute top-3 right-3 bg-white/90 text-donation-primary hover:bg-white">
                {post.category}
              </Badge>
            </div>
            
            <div className="p-6">
              <div className="flex items-center text-sm text-gray-500 mb-3">
                <User size={14} className="mr-1" />
                <span className="mr-3">{post.author}</span>
                <Calendar size={14} className="mr-1" />
                <span>{new Date(post.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
              </div>
              
              <h3 className="text-xl font-bold mb-2 line-clamp-2">{post.title}</h3>
              
              <p className="text-gray-600 mb-4 line-clamp-3">{post.excerpt}</p>
              
              <Link 
                to={`/blog/${post.id}`} 
                className="inline-flex items-center text-donation-primary font-medium hover:text-donation-primary/80 transition-colors"
              >
                Read more <ArrowRight size={16} className="ml-1" />
              </Link>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

const BlogPostDetails = ({ postId }: { postId: number }) => {
  const post = BlogPosts.find(p => p.id === postId);
  
  if (!post) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-800">Post not found</h2>
        <p className="mt-4 text-gray-600">The blog post you're looking for doesn't exist.</p>
        <Button asChild className="mt-6">
          <Link to="/blog">Back to Blog</Link>
        </Button>
      </div>
    );
  }
  
  return (
    <div className="max-w-4xl mx-auto bg-white/90 backdrop-blur-md rounded-xl shadow-md overflow-hidden">
      <div className="relative h-80">
        <img 
          src={post.imageUrl} 
          alt={post.title} 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-6">
          <div className="text-white">
            <Badge className="mb-3 bg-donation-primary border-none hover:bg-donation-primary/90">
              {post.category}
            </Badge>
            <h1 className="text-3xl md:text-4xl font-bold">{post.title}</h1>
          </div>
        </div>
      </div>
      
      <div className="p-6 md:p-8">
        <div className="flex items-center justify-between mb-6 pb-6 border-b border-gray-200">
          <div className="flex items-center">
            <div className="w-12 h-12 rounded-full bg-donation-primary/20 flex items-center justify-center text-donation-primary mr-4">
              {post.author.charAt(0)}
            </div>
            <div>
              <h3 className="font-medium">{post.author}</h3>
              <p className="text-sm text-gray-500">{post.authorRole}</p>
            </div>
          </div>
          
          <div className="flex items-center text-sm text-gray-500">
            <Calendar size={14} className="mr-1" />
            <span className="mr-3">{new Date(post.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
            <Clock size={14} className="mr-1" />
            <span>{post.readTime}</span>
          </div>
        </div>
        
        <div 
          className="prose prose-lg max-w-none"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
        
        <div className="mt-8 pt-6 border-t border-gray-200">
          <div className="flex flex-wrap gap-2 mb-6">
            {post.tags.map((tag, index) => (
              <Badge key={index} variant="outline" className="bg-gray-50">
                #{tag}
              </Badge>
            ))}
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" className="flex items-center">
                <Heart size={16} className="mr-1" /> Like
              </Button>
              <Button variant="ghost" size="sm" className="flex items-center">
                <MessageSquare size={16} className="mr-1" /> Comment
              </Button>
              <Button variant="ghost" size="sm" className="flex items-center">
                <Share2 size={16} className="mr-1" /> Share
              </Button>
            </div>
            
            <Button asChild variant="outline">
              <Link to="/blog">Back to all posts</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

const Newsletter = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.5 }}
      className="text-center mt-12 bg-white/80 backdrop-blur-md p-8 rounded-xl shadow-md"
    >
      <BookOpen className="h-10 w-10 text-donation-primary mx-auto mb-4" />
      <h2 className="text-2xl font-bold mb-2">Subscribe to our newsletter</h2>
      <p className="text-gray-600 mb-6">
        Stay updated with the latest news, events, and stories from Nilgiri College's Happiness Club
      </p>
      <div className="flex flex-col sm:flex-row gap-2 justify-center mt-4 max-w-md mx-auto">
        <input 
          type="email" 
          placeholder="Enter your email" 
          className="px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-donation-primary focus:border-transparent flex-grow" 
        />
        <Button className="bg-donation-primary hover:bg-donation-primary/90">
          Subscribe
        </Button>
      </div>
    </motion.div>
  );
};

const Blog = () => {
  // Extract post ID from URL if present
  const pathParts = window.location.pathname.split('/');
  const postIdParam = pathParts.length > 2 ? parseInt(pathParts[pathParts.length - 1]) : null;
  const isDetailView = postIdParam !== null && !isNaN(postIdParam);
  
  return (
    <div className="min-h-screen">
      <AnimatedBackground variant="leaderboard" />
      <Navbar />
      
      <div className="container mx-auto px-4 pt-24 md:pt-32 pb-12 md:pb-20">
        {!isDetailView && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <div className="inline-block rounded-full bg-donation-primary/10 px-4 py-1.5 mb-4">
              <span className="text-sm font-medium text-donation-primary">Latest Updates</span>
            </div>
            
            <h1 className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-donation-primary to-purple-600">
              Blog & News
            </h1>
            
            <p className="text-gray-600 max-w-xl mx-auto">
              Stay updated with the latest news, events, and stories from Nilgiri College's Happiness Club
            </p>
          </motion.div>
        )}
        
        {isDetailView ? (
          <BlogPostDetails postId={postIdParam} />
        ) : (
          <>
            <BlogPostsList />
            <Newsletter />
          </>
        )}
      </div>
    </div>
  );
};

export default Blog;
