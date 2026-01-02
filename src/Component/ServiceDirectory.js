import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Typography,
  Box,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  Button,
  IconButton,
  Drawer,
  CircularProgress,
  Alert,
  Avatar,
  Badge,
  alpha,
  useTheme,
  useMediaQuery,
  Card,
  CardContent,
  CardMedia,
  CardActions,
  Rating
} from '@mui/material';
import {
  Search,
  FilterList,
  Close,
  Phone,
  Email,
  LocationOn,
  Category,
  Star,
  Sort,
  TrendingUp,
  WorkspacePremium,
  LocalOffer,
  ArrowForward,
  Favorite,
  FavoriteBorder,
  Share,
  ExpandMore,
  ChevronRight
} from '@mui/icons-material';
import servicesData from '../Data/Sevice.json';

const ServiceDirectory = () => {
  const [services, setServices] = useState([]);
  const [filteredServices, setFilteredServices] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedCity, setSelectedCity] = useState('All');
  const [selectedService, setSelectedService] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('rating');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [favorites, setFavorites] = useState([]);
  
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'lg'));

  // Extract unique categories and cities
  const categories = ['All', ...new Set(servicesData.map(service => service.category))];
  const cities = ['All', ...new Set(servicesData.map(service => service.city))];

  useEffect(() => {
    // Simulate loading
    setTimeout(() => {
      setServices(servicesData);
      setFilteredServices(servicesData);
      setLoading(false);
    }, 1500);
  }, []);

  useEffect(() => {
    let filtered = [...services];

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(service =>
        service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        service.tagline.toLowerCase().includes(searchTerm.toLowerCase()) ||
        service.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply category filter
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(service => service.category === selectedCategory);
    }

    // Apply city filter
    if (selectedCity !== 'All') {
      filtered = filtered.filter(service => service.city === selectedCity);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'rating':
          return b.rating - a.rating;
        case 'reviews':
          return b.reviews - a.reviews;
        case 'price':
          return a.price.length - b.price.length;
        default:
          return 0;
      }
    });

    setFilteredServices(filtered);
  }, [searchTerm, selectedCategory, selectedCity, services, sortBy]);

  const handleServiceClick = (service) => {
    setSelectedService(service);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedService(null);
  };

  const handleCall = (phone) => {
    window.location.href = `tel:${phone}`;
  };

  const handleEmail = (email) => {
    window.location.href = `mailto:${email}`;
  };

  const handleFavorite = (id) => {
    setFavorites(prev => 
      prev.includes(id) 
        ? prev.filter(favId => favId !== id)
        : [...prev, id]
    );
  };

  const resetFilters = () => {
    setSearchTerm('');
    setSelectedCategory('All');
    setSelectedCity('All');
    setSortBy('rating');
  };

  const getCategoryColor = (category) => {
    const colors = {
      'Technology': '#2196f3',
      'Home Services': '#4caf50',
      'Professional Services': '#673ab7',
      'Health & Wellness': '#ff5722',
      'Food & Beverage': '#ff9800',
      'Transportation': '#009688',
      'Retail': '#e91e63'
    };
    return colors[category] || theme.palette.primary.main;
  };

  const renderServiceCard = (service) => (
    <Card
      sx={{
        height:500,
        width:360,
        display: 'flex',
        flexDirection: 'column',
        borderRadius: 1,
        overflow: 'hidden',
        boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        position: 'relative',
        '&:hover': {
          transform: 'translateY(-8px)',
          boxShadow: '0 16px 32px rgba(0,0,0,0.12)',
          '& .service-image': {
            transform: 'scale(1.05)'
          }
        }
      }}
    >
      {/* Favorite Button */}
      <IconButton
        sx={{
          position: 'absolute',
          top: 12,
          right: 12,
          backgroundColor: 'rgba(255,255,255,0.9)',
          backdropFilter: 'blur(4px)',
          zIndex: 2,
          '&:hover': {
            backgroundColor: 'white'
          }
        }}
        onClick={(e) => {
          e.stopPropagation();
          handleFavorite(service.id);
        }}
      >
        {favorites.includes(service.id) ? (
          <Favorite sx={{ color: '#ff4081' }} />
        ) : (
          <FavoriteBorder />
        )}
      </IconButton>

      {/* Image Container */}
      <Box sx={{ position: 'relative', height: 300, overflow: 'hidden' }}>
        <CardMedia
          component="img"
          height="200"
          image={service.image}
          alt={service.name}
          className="service-image"
          sx={{
            transition: 'transform 0.5s ease',
            objectFit: 'cover'
          }}
        />
        
        {/* Gradient Overlay */}
        <Box
          sx={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '60%',
            background: `linear-gradient(to top, ${alpha(service.color || theme.palette.primary.main, 0.9)} 0%, transparent 100%)`
          }}
        />
        
        {/* Category Badge */}
        <Chip
          label={service.category}
          size="small"
          sx={{
            position: 'absolute',
            top: 12,
            left: 12,
            backgroundColor: alpha(getCategoryColor(service.category), 0.9),
            color: 'white',
            fontWeight: 'bold',
            backdropFilter: 'blur(4px)'
          }}
        />
        
        {/* Price Indicator */}
        <Box
          sx={{
            position: 'absolute',
            bottom: 12,
            right: 12,
            backgroundColor: 'white',
            borderRadius: 2,
            px: 1.5,
            py: 0.5,
            display: 'flex',
            alignItems: 'center',
            gap: 0.5,
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
          }}
        >
          <LocalOffer fontSize="small" sx={{ color: 'text.secondary' }} />
          <Typography variant="caption" fontWeight="bold">
            {service.price}
          </Typography>
        </Box>
      </Box>

      <CardContent sx={{ flexGrow: 1, p: 3 }}>
        {/* Service Name and Tagline */}
        <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ lineHeight: 1.2 }}>
          {service.name}
        </Typography>
        <Typography 
          variant="body2" 
          color="text.secondary" 
          gutterBottom
          sx={{ 
            mb: 2,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden'
          }}
        >
          {service.tagline}
        </Typography>

        {/* Rating Section */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mr: 2 }}>
            <Star sx={{ color: '#ffb400', fontSize: 18, mr: 0.5 }} />
            <Typography variant="body2" fontWeight="bold">
              {service.rating}
            </Typography>
          </Box>
          <Typography variant="caption" color="text.secondary">
            ({service.reviews} reviews)
          </Typography>
        </Box>

        {/* Location */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <LocationOn sx={{ fontSize: 16, color: 'text.secondary', mr: 1 }} />
          <Typography variant="body2" color="text.secondary">
            {service.city}
          </Typography>
        </Box>

        {/* Features */}
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 2 }}>
          {service.features.slice(0, 2).map((feature, index) => (
            <Chip
              key={index}
              label={feature}
              size="small"
              variant="outlined"
              sx={{ 
                fontSize: '0.7rem',
                height: 24,
                borderColor: alpha(getCategoryColor(service.category), 0.3),
                color: alpha(getCategoryColor(service.category), 0.8)
              }}
            />
          ))}
          {service.features.length > 2 && (
            <Chip
              label={`+${service.features.length - 2}`}
              size="small"
              sx={{ 
                fontSize: '0.7rem',
                height: 24,
                backgroundColor: alpha(theme.palette.primary.main, 0.1)
              }}
            />
          )}
        </Box>
      </CardContent>

      <CardActions sx={{ p: 3, pt: 0 }}>
        <Button
          fullWidth
          variant="contained"
          endIcon={<ArrowForward />}
          onClick={() => handleServiceClick(service)}
          sx={{
            borderRadius: 2,
            py: 1.5,
            background: `linear-gradient(135deg, ${service.color} 0%, ${alpha(service.color, 0.8)} 100%)`,
            '&:hover': {
              background: `linear-gradient(135deg, ${alpha(service.color, 0.9)} 0%, ${alpha(service.color, 0.7)} 100%)`,
              transform: 'translateY(-1px)'
            }
          }}
        >
          View Details
        </Button>
      </CardActions>
    </Card>
  );

  const renderServiceModal = () => (
    <Drawer
      anchor="right"
      open={modalOpen}
      onClose={handleCloseModal}
      PaperProps={{
        sx: {
          width: isMobile ? '100%' : isTablet ? '70%' : '40%',
          borderTopLeftRadius: 16,
          borderBottomLeftRadius: 16,
          overflow: 'hidden'
        }
      }}
    >
      {selectedService && (
        <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
          {/* Header */}
          <Box
            sx={{
              background: `linear-gradient(135deg, ${selectedService.color} 0%, ${alpha(selectedService.color, 0.7)} 100%)`,
              color: 'white',
              p: 4,
              position: 'relative'
            }}
          >
            <IconButton
              onClick={handleCloseModal}
              sx={{
                position: 'absolute',
                top: 16,
                right: 16,
                color: 'white',
                backgroundColor: 'rgba(255,255,255,0.2)',
                backdropFilter: 'blur(4px)'
              }}
            >
              <Close />
            </IconButton>
            
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Avatar
                sx={{
                  width: 60,
                  height: 60,
                  backgroundColor: 'white',
                  color: selectedService.color,
                  fontSize: 24,
                  fontWeight: 'bold',
                  mr: 2
                }}
              >
                {selectedService.name.charAt(0)}
              </Avatar>
              <Box>
                <Typography variant="h5" fontWeight="bold" gutterBottom>
                  {selectedService.name}
                </Typography>
                <Typography variant="body1">
                  {selectedService.tagline}
                </Typography>
              </Box>
            </Box>
            
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
              <Chip
                label={selectedService.category}
                sx={{
                  backgroundColor: 'white',
                  color: selectedService.color,
                  fontWeight: 'bold'
                }}
              />
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Star sx={{ mr: 0.5 }} />
                <Typography>
                  {selectedService.rating} • {selectedService.reviews} reviews
                </Typography>
              </Box>
            </Box>
          </Box>

          {/* Content */}
          <Box sx={{ flexGrow: 1, overflow: 'auto', p: 3 }}>
            {/* Description */}
            <Box sx={{ mb: 4 }}>
              <Typography variant="h6" gutterBottom fontWeight="bold">
                About This Service
              </Typography>
              <Typography variant="body1" color="text.secondary">
                {selectedService.description}
              </Typography>
            </Box>

            {/* Features */}
            <Box sx={{ mb: 4 }}>
              <Typography variant="h6" gutterBottom fontWeight="bold">
                Key Features
              </Typography>
              <Grid container spacing={1}>
                {selectedService.features.map((feature, index) => (
                  <Grid item xs={6} key={index}>
                    <Box
                      sx={{
                        p: 2,
                        borderRadius: 2,
                        backgroundColor: alpha(selectedService.color, 0.05),
                        border: `1px solid ${alpha(selectedService.color, 0.1)}`,
                        display: 'flex',
                        alignItems: 'center'
                      }}
                    >
                      <WorkspacePremium sx={{ mr: 1, color: selectedService.color }} />
                      <Typography variant="body2">{feature}</Typography>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </Box>

            {/* Contact Info */}
            <Box sx={{ mb: 4 }}>
              <Typography variant="h6" gutterBottom fontWeight="bold">
                Contact Information
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Box
                    sx={{
                      p: 2,
                      borderRadius: 2,
                      backgroundColor: alpha(theme.palette.primary.main, 0.05),
                      border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`
                    }}
                  >
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                      <LocationOn sx={{ fontSize: 16, mr: 1, verticalAlign: 'middle' }} />
                      Location
                    </Typography>
                    <Typography variant="body2">{selectedService.address}</Typography>
                    <Typography variant="body2">{selectedService.city}</Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Box
                    sx={{
                      p: 2,
                      borderRadius: 2,
                      backgroundColor: alpha(theme.palette.success.main, 0.05),
                      border: `1px solid ${alpha(theme.palette.success.main, 0.1)}`
                    }}
                  >
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                      <Phone sx={{ fontSize: 16, mr: 1, verticalAlign: 'middle' }} />
                      Phone
                    </Typography>
                    <Typography variant="body2">{selectedService.phone}</Typography>
                  </Box>
                </Grid>
              </Grid>
            </Box>
          </Box>

          {/* Footer */}
          <Box sx={{ p: 3, borderTop: 1, borderColor: 'divider' }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Button
                  fullWidth
                  variant="contained"
                  startIcon={<Phone />}
                  onClick={() => handleCall(selectedService.phone)}
                  sx={{
                    py: 1.5,
                    borderRadius: 2,
                    background: `linear-gradient(135deg, ${theme.palette.success.main} 0%, ${alpha(theme.palette.success.main, 0.8)} 100%)`
                  }}
                >
                  Call Now
                </Button>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<Email />}
                  onClick={() => handleEmail(selectedService.email)}
                  sx={{ py: 1.5, borderRadius: 2 }}
                >
                  Send Email
                </Button>
              </Grid>
            </Grid>
          </Box>
        </Box>
      )}
    </Drawer>
  );

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
        }}
      >
        <Box
          sx={{
            p: 4,
            borderRadius: 4,
            backgroundColor: 'rgba(255,255,255,0.9)',
            backdropFilter: 'blur(10px)',
            textAlign: 'center'
          }}
        >
          <CircularProgress size={60} thickness={4} sx={{ color: '#667eea', mb: 3 }} />
          <Typography variant="h6" fontWeight="bold" color="primary">
            Loading Services
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Preparing amazing services for you...
          </Typography>
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#f8fafc' }}>
      {/* Hero Header */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          pt: 8,
          pb: 6,
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        {/* Background Pattern */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            opacity: 0.1,
            backgroundImage: `radial-gradient(circle at 25% 25%, white 2px, transparent 2px)`,
            backgroundSize: '40px 40px'
          }}
        />
        
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: 4, position: 'relative', zIndex: 1 }}>
            <Typography 
              variant="h1" 
              fontWeight="bold" 
              sx={{ 
                fontSize: { xs: '2.5rem', md: '3.5rem' },
                mb: 2,
                background: 'linear-gradient(to right, #ffffff, #e0e0e0)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}
            >
              Discover Amazing Services
            </Typography>
            <Typography 
              variant="h5" 
              sx={{ 
                opacity: 0.9,
                mb: 4,
                maxWidth: 600,
                mx: 'auto'
              }}
            >
              Find the perfect service providers for all your needs
            </Typography>
          </Box>

          {/* Search Bar */}
          <Box sx={{ position: 'relative', zIndex: 1 }}>
            <Box
              sx={{
                backgroundColor: 'white',
                borderRadius: 2,
                p: 2,
                boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
                maxWidth: 900,
                mx: 'auto'
              }}
            >
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    placeholder="Search services..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    InputProps={{
                      startAdornment: <Search sx={{ mr: 1, color: 'primary.main' }} />,
                      sx: { borderRadius: 3 }
                    }}
                    variant="outlined"
                  />
                </Grid>
                
                <Grid item xs={6} md={3} sx={{ml:16}}>
                  <FormControl fullWidth >
                    <Select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      displayEmpty
                      sx={{ borderRadius: 1 }}
                    >
                      <MenuItem value="All">All Categories</MenuItem>
                      {categories.slice(1).map((category) => (
                        <MenuItem key={category} value={category}>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Box
                              sx={{
                                width: 12,
                                height: 12,
                                borderRadius: '50%',
                                backgroundColor: getCategoryColor(category),
                                mr: 1
                              }}
                            />
                            {category}
                          </Box>
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                
                <Grid item xs={6} md={3}>
                  <FormControl fullWidth>
                    <Select
                      value={selectedCity}
                      onChange={(e) => setSelectedCity(e.target.value)}
                      displayEmpty
                      sx={{ borderRadius: 1 }}
                    >
                      <MenuItem value="All">All Cities</MenuItem>
                      {cities.slice(1).map((city) => (
                        <MenuItem key={city} value={city}>{city}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                
                <Grid item xs={12} md={2}>
                  <Button
                    fullWidth
                    variant="contained"
                    startIcon={<FilterList />}
                    onClick={() => setDrawerOpen(true)}
                    sx={{ 
                      py: 1.5,
                      borderRadius: 1,
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                    }}
                  >
                    Filters
                  </Button>
                </Grid>
              </Grid>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Main Content */}
      <Container maxWidth="lg" sx={{ py: 6 }}>
        {/* Stats Bar */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 4,
            p: 3,
            backgroundColor: 'white',
            borderRadius: 1,
            boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
          }}
        >
          <Box>
            <Typography variant="h5" fontWeight="bold">
              {filteredServices.length} Services Found
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Showing results for {selectedCategory === 'All' ? 'all categories' : selectedCategory} 
              {selectedCity !== 'All' && ` in ${selectedCity}`}
            </Typography>
          </Box>
          
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <Select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                startAdornment={<Sort sx={{ mr: 1 }} />}
              >
                <MenuItem value="rating">Top Rated</MenuItem>
                <MenuItem value="reviews">Most Reviews</MenuItem>
                <MenuItem value="name">Name A-Z</MenuItem>
                <MenuItem value="price">Price</MenuItem>
              </Select>
            </FormControl>
            
            <Button
              variant="outlined"
              onClick={resetFilters}
              startIcon={<Close />}
            >
              Clear Filters
            </Button>
          </Box>
        </Box>

        {/* Services Grid */}
        {filteredServices.length === 0 ? (
          <Box
            sx={{
              textAlign: 'center',
              py: 10,
              px: 3,
              backgroundColor: 'white',
              borderRadius: 3,
              boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
            }}
          >
            <Search sx={{ fontSize: 80, color: 'text.secondary', mb: 3, opacity: 0.3 }} />
            <Typography variant="h5" gutterBottom fontWeight="bold">
              No services found
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 4, maxWidth: 400, mx: 'auto' }}>
              Try adjusting your search or filters to find what you're looking for.
            </Typography>
            <Button
              variant="contained"
              onClick={resetFilters}
              sx={{ 
                borderRadius: 2,
                px: 4,
                py: 1.5,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
              }}
            >
              Reset All Filters
            </Button>
          </Box>
        ) : (
          <Grid container spacing={3}>
            {filteredServices.map((service) => (
              <Grid item xs={12} sm={6} lg={4} key={service.id}>
                {renderServiceCard(service)}
              </Grid>
            ))}
          </Grid>
        )}

        {/* View Favorites Button */}
        {favorites.length > 0 && (
          <Box sx={{ position: 'fixed', bottom: 24, right: 24, zIndex: 1000 }}>
            <Button
              variant="contained"
              startIcon={<Favorite />}
              sx={{
                borderRadius: 3,
                px: 3,
                py: 1.5,
                boxShadow: '0 8px 24px rgba(244, 67, 54, 0.3)',
                background: 'linear-gradient(135deg, #ff4081 0%, #f50057 100%)',
                '&:hover': {
                  boxShadow: '0 12px 32px rgba(244, 67, 54, 0.4)'
                }
              }}
            >
              View Favorites ({favorites.length})
            </Button>
          </Box>
        )}
      </Container>

      {/* Footer */}
      <Box
        sx={{
          mt: 8,
          py: 4,
          backgroundColor: 'white',
          borderTop: 1,
          borderColor: 'divider'
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Service Directory
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Your one-stop destination for finding trusted service providers. 
                We connect you with professionals across various industries.
              </Typography>
            </Grid>
            
            <Grid item xs={6} md={2}>
              <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                Categories
              </Typography>
              {categories.slice(1, 5).map((category) => (
                <Typography key={category} variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  {category}
                </Typography>
              ))}
            </Grid>
            
            <Grid item xs={6} md={2}>
              <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                Cities
              </Typography>
              {cities.slice(1, 5).map((city) => (
                <Typography key={city} variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  {city}
                </Typography>
              ))}
            </Grid>
            
            <Grid item xs={12} md={4}>
              <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                Stay Updated
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Subscribe to get notified about new services and special offers.
              </Typography>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <TextField
                  placeholder="Your email"
                  size="small"
                  fullWidth
                  sx={{ borderRadius: 2 }}
                />
                <Button variant="contained" sx={{ borderRadius: 1 }}>
                  Subscribe
                </Button>
              </Box>
            </Grid>
          </Grid>
          
          <Box sx={{ mt: 4, pt: 3, borderTop: 1, borderColor: 'divider', textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              © {new Date().getFullYear()} Service Directory. All rights reserved.
            </Typography>
          </Box>
        </Container>
      </Box>

      {/* Service Detail Drawer */}
      {renderServiceModal()}

      {/* Filters Drawer */}
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        PaperProps={{
          sx: {
            width: { xs: '100%', sm: 400 },
            p: 3
          }
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h6" fontWeight="bold">
            Filters
          </Typography>
          <IconButton onClick={() => setDrawerOpen(false)}>
            <Close />
          </IconButton>
        </Box>
        
        <Box sx={{ mb: 4 }}>
          <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
            Sort By
          </Typography>
          <Grid container spacing={1}>
            {['rating', 'reviews', 'name', 'price'].map((sort) => (
              <Grid item xs={6} key={sort}>
                <Button
                  fullWidth
                  variant={sortBy === sort ? 'contained' : 'outlined'}
                  onClick={() => setSortBy(sort)}
                  sx={{ borderRadius: 2 }}
                >
                  {sort === 'rating' && 'Top Rated'}
                  {sort === 'reviews' && 'Most Reviews'}
                  {sort === 'name' && 'Name A-Z'}
                  {sort === 'price' && 'Price'}
                </Button>
              </Grid>
            ))}
          </Grid>
        </Box>
        
        <Box sx={{ mb: 4 }}>
          <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
            Categories
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {categories.slice(1).map((category) => (
              <Chip
                key={category}
                label={category}
                onClick={() => setSelectedCategory(category)}
                color={selectedCategory === category ? 'primary' : 'default'}
                sx={{ borderRadius: 1 }}
              />
            ))}
          </Box>
        </Box>
        
        <Box sx={{ mb: 4 }}>
          <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
            Cities
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {cities.slice(1).map((city) => (
              <Chip
                key={city}
                label={city}
                onClick={() => setSelectedCity(city)}
                color={selectedCity === city ? 'primary' : 'default'}
                sx={{ borderRadius: 1 }}
              />
            ))}
          </Box>
        </Box>
        
        <Box sx={{ position: 'absolute', bottom: 20, left: 20, right: 20 }}>
          <Button
            fullWidth
            variant="contained"
            onClick={resetFilters}
            sx={{ 
              borderRadius: 2,
              py: 1.5,
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
            }}
          >
            Apply Filters
          </Button>
        </Box>
      </Drawer>
    </Box>
  );
};

export default ServiceDirectory;