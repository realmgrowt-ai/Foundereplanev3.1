#!/usr/bin/env python3
import requests
import json
import sys
import uuid
from datetime import datetime
from typing import Dict, Any, List

class FounderPlaneAPITester:
    def __init__(self, base_url="https://hello-demo-252.preview.emergentagent.com"):
        self.base_url = base_url
        self.admin_password = "founderplane2024"
        self.tests_run = 0
        self.tests_passed = 0
        self.failures = []

    def run_test(self, name: str, method: str, endpoint: str, expected_status: int, 
                 data: Dict[Any, Any] = None, headers: Dict[str, str] = None, timeout: int = 30) -> tuple:
        """Run a single API test"""
        url = f"{self.base_url}{endpoint}"
        
        # Default headers
        default_headers = {'Content-Type': 'application/json'}
        if headers:
            default_headers.update(headers)

        self.tests_run += 1
        print(f"\n🔍 Testing {name}...")
        print(f"   {method} {endpoint}")
        
        try:
            response = None
            if method == 'GET':
                response = requests.get(url, headers=default_headers, timeout=timeout)
            elif method == 'POST':
                response = requests.post(url, json=data, headers=default_headers, timeout=timeout)
            elif method == 'PATCH':
                response = requests.patch(url, json=data, headers=default_headers, timeout=timeout)

            success = response.status_code == expected_status
            
            if success:
                self.tests_passed += 1
                print(f"   ✅ Passed - Status: {response.status_code}")
                try:
                    response_json = response.json()
                    return True, response_json
                except:
                    return True, {}
            else:
                error_msg = f"Expected {expected_status}, got {response.status_code}"
                try:
                    error_detail = response.json()
                    error_msg += f" - {error_detail}"
                except:
                    error_msg += f" - {response.text[:200]}"
                
                print(f"   ❌ Failed - {error_msg}")
                self.failures.append(f"{name}: {error_msg}")
                return False, {}

        except requests.exceptions.Timeout:
            error_msg = f"Request timeout after {timeout}s"
            print(f"   ❌ Failed - {error_msg}")
            self.failures.append(f"{name}: {error_msg}")
            return False, {}
        except Exception as e:
            error_msg = f"Error: {str(e)}"
            print(f"   ❌ Failed - {error_msg}")
            self.failures.append(f"{name}: {error_msg}")
            return False, {}

    def test_backend_health(self):
        """Test basic backend health"""
        return self.run_test("API Health Check", "GET", "/api/", 200)

    def test_lead_creation(self):
        """Test lead creation endpoint"""
        test_lead = {
            "name": "Test User",
            "email": f"test_{uuid.uuid4().hex[:8]}@example.com",
            "phone": "+91-9876543210",
            "company": "Test Company",
            "service_interest": "BoltRunway",
            "source_page": "BoltRunway",
            "message": "This is a test lead"
        }
        
        success, response = self.run_test("Lead Creation", "POST", "/api/leads", 201, test_lead)
        
        if success and response:
            # Verify response structure
            required_fields = ['id', 'name', 'email', 'created_at', 'status']
            missing_fields = [field for field in required_fields if field not in response]
            
            if missing_fields:
                print(f"   ⚠️  Warning: Missing fields in response: {missing_fields}")
                self.failures.append(f"Lead Creation: Missing response fields: {missing_fields}")
                return False, {}
            
            print(f"   ✅ Lead created with ID: {response.get('id')}")
            return True, response
        
        return False, {}

    def test_admin_login(self):
        """Test admin authentication"""
        login_data = {"password": self.admin_password}
        return self.run_test("Admin Login", "POST", "/api/admin/login", 200, login_data)

    def test_admin_login_invalid(self):
        """Test admin authentication with invalid password"""
        login_data = {"password": "wrongpassword"}
        return self.run_test("Admin Login (Invalid)", "POST", "/api/admin/login", 401, login_data)

    def test_get_leads(self):
        """Test getting leads with admin auth"""
        headers = {"X-Admin-Password": self.admin_password}
        return self.run_test("Get Leads (Admin)", "GET", "/api/leads", 200, headers=headers)

    def test_get_leads_unauthorized(self):
        """Test getting leads without admin auth"""
        return self.run_test("Get Leads (Unauthorized)", "GET", "/api/leads", 401)

    def test_lead_stats(self):
        """Test lead statistics endpoint"""
        headers = {"X-Admin-Password": self.admin_password}
        success, response = self.run_test("Lead Statistics", "GET", "/api/leads/stats", 200, headers=headers)
        
        if success and response:
            # Verify stats structure
            expected_fields = ['total', 'recent_7_days', 'by_service', 'by_stage', 'by_status']
            missing_fields = [field for field in expected_fields if field not in response]
            
            if missing_fields:
                print(f"   ⚠️  Warning: Missing stats fields: {missing_fields}")
            else:
                print(f"   ✅ Stats: Total leads: {response.get('total', 0)}")
        
        return success, response

    def test_scroll_analytics(self):
        """Test scroll analytics tracking"""
        scroll_data = {
            "page": "BoltRunway",
            "section": "hero",
            "section_index": 0,
            "total_sections": 8,
            "session_id": f"test_session_{uuid.uuid4().hex[:8]}",
            "viewport_height": 1080
        }
        
        return self.run_test("Scroll Analytics", "POST", "/api/analytics/scroll-events", 201, scroll_data)

    def test_scroll_analytics_batch(self):
        """Test batch scroll analytics tracking (NEW in this iteration)"""
        session_id = f"test_batch_session_{uuid.uuid4().hex[:8]}"
        batch_data = [
            {
                "page": "BoltRunway",
                "section": "hero",
                "section_index": 0,
                "total_sections": 9,
                "session_id": session_id,
                "viewport_height": 1080
            },
            {
                "page": "BoltRunway", 
                "section": "diagnosis",
                "section_index": 1,
                "total_sections": 9,
                "session_id": session_id,
                "viewport_height": 1080
            },
            {
                "page": "Index",
                "section": "hero",
                "section_index": 0,
                "total_sections": 7,
                "session_id": session_id,
                "viewport_height": 1080
            }
        ]
        
        success, response = self.run_test("Scroll Analytics Batch", "POST", "/api/analytics/scroll-events/batch", 201, batch_data)
        
        if success and response:
            expected_count = len(batch_data)
            actual_count = response.get('count', 0)
            if actual_count != expected_count:
                print(f"   ⚠️  Warning: Expected {expected_count} events, got {actual_count}")
            else:
                print(f"   ✅ Batch processed {actual_count} scroll events")
        
        return success, response

    def test_scroll_analytics_stats(self):
        """Test scroll analytics stats with days parameter (admin only)"""
        headers = {"X-Admin-Password": self.admin_password}
        
        # Test with default days parameter
        success, response = self.run_test("Scroll Analytics Stats (30d)", "GET", "/api/analytics/scroll-stats?days=30", 200, headers=headers)
        
        if success and response:
            # Verify stats structure
            expected_fields = ['total_sessions', 'total_events', 'days', 'page_visitors', 'section_stats']
            missing_fields = [field for field in expected_fields if field not in response]
            
            if missing_fields:
                print(f"   ⚠️  Warning: Missing scroll stats fields: {missing_fields}")
            else:
                print(f"   ✅ Scroll Stats: {response.get('total_sessions', 0)} sessions, {response.get('total_events', 0)} events")
                print(f"   ✅ Pages with data: {len(response.get('page_visitors', []))}")
        
        return success, response

    def test_scroll_analytics_stats_different_days(self):
        """Test scroll analytics stats with different day ranges"""
        headers = {"X-Admin-Password": self.admin_password}
        
        # Test different day ranges that should be available in admin UI
        for days in [7, 14, 90]:
            success, response = self.run_test(f"Scroll Stats ({days}d)", "GET", f"/api/analytics/scroll-stats?days={days}", 200, headers=headers)
            if success and response:
                print(f"   ✅ {days}d range: {response.get('total_sessions', 0)} sessions")
        
        return True, {}

    def test_stage_assessment_ai(self):
        """Test AI-powered stage assessment"""
        assessment_data = {
            "answers": {
                "current_situation": "generating_revenue",
                "hardest_right_now": "operational_chaos",
                "business_direction": "scaling_existing",
                "dependency": "everything_through_me",
                "scale_readiness": "breaking_at_current_volume",
                "decision_bottleneck": "im_the_bottleneck",
                "intent": "build_systems"
            },
            "user_details": {
                "name": "Test Founder",
                "email": f"test_founder_{uuid.uuid4().hex[:8]}@example.com",
                "phone": "+91-9876543210"
            }
        }
        
        success, response = self.run_test("AI Stage Assessment", "POST", "/api/stage-assessment", 200, assessment_data, timeout=60)
        
        if success and response:
            # Verify AI response structure
            expected_fields = ['stage', 'bottleneck', 'stage_description', 'recommended_system', 'lead_id']
            missing_fields = [field for field in expected_fields if field not in response]
            
            if missing_fields:
                print(f"   ⚠️  Warning: Missing AI response fields: {missing_fields}")
            else:
                print(f"   ✅ AI Assessment: Stage={response.get('stage')}, Bottleneck={response.get('bottleneck')}")
        
        return success, response

    def test_lead_status_update(self):
        """Test updating lead status (admin only)"""
        # First create a lead
        test_lead = {
            "name": "Status Test User",
            "email": f"statustest_{uuid.uuid4().hex[:8]}@example.com",
            "service_interest": "BoltRunway"
        }
        
        lead_success, lead_response = self.test_lead_creation()
        if not lead_success or not lead_response:
            print("   ❌ Cannot test status update - lead creation failed")
            return False, {}
        
        lead_id = lead_response.get('id')
        if not lead_id:
            print("   ❌ Cannot test status update - no lead ID returned")
            return False, {}
        
        # Update lead status
        headers = {"X-Admin-Password": self.admin_password}
        status_data = {"status": "Contacted"}
        
        return self.run_test("Lead Status Update", "PATCH", f"/api/leads/{lead_id}/status", 
                           200, status_data, headers=headers)

    def run_comprehensive_test_suite(self):
        """Run all backend tests"""
        print("🚀 Starting FounderPlane API Test Suite")
        print("=" * 60)
        
        # Basic API Health
        print("\n📋 BASIC API TESTS")
        self.test_backend_health()
        
        # Authentication Tests
        print("\n🔐 AUTHENTICATION TESTS")
        self.test_admin_login()
        self.test_admin_login_invalid()
        
        # Lead Management Tests
        print("\n👥 LEAD MANAGEMENT TESTS")
        self.test_lead_creation()
        self.test_get_leads()
        self.test_get_leads_unauthorized()
        self.test_lead_stats()
        self.test_lead_status_update()
        
        # Analytics Tests
        print("\n📊 ANALYTICS TESTS")
        self.test_scroll_analytics()
        self.test_scroll_analytics_stats()
        
        # AI Integration Tests
        print("\n🤖 AI INTEGRATION TESTS")
        self.test_stage_assessment_ai()
        
        # Print Summary
        print("\n" + "=" * 60)
        print(f"📊 FINAL RESULTS")
        print(f"✅ Tests Passed: {self.tests_passed}/{self.tests_run}")
        print(f"❌ Tests Failed: {len(self.failures)}")
        
        if self.failures:
            print(f"\n🚨 FAILURES:")
            for i, failure in enumerate(self.failures, 1):
                print(f"   {i}. {failure}")
        
        success_rate = (self.tests_passed / self.tests_run * 100) if self.tests_run > 0 else 0
        print(f"\n📈 Success Rate: {success_rate:.1f}%")
        
        return self.tests_passed == self.tests_run

def main():
    """Main test runner"""
    tester = FounderPlaneAPITester()
    
    try:
        all_passed = tester.run_comprehensive_test_suite()
        return 0 if all_passed else 1
    except KeyboardInterrupt:
        print("\n⏹️  Tests interrupted by user")
        return 1
    except Exception as e:
        print(f"\n💥 Unexpected error: {e}")
        return 1

if __name__ == "__main__":
    sys.exit(main())